import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreaObraDto, listaObrasPorUsuarioIdDto } from '../dtos/crud.obra';
import {  ObraEntity } from '../entities/obra.entity';
import { IObraRepository, IOBRA_REPOSITORY } from '../patronAdapter/obra.interface';
import { JwtService } from '@nestjs/jwt';
import { GoogleDriveService } from 'src/managerdrive/services/googleDriveService';
import { IAuthRepository, IAUTH_REPOSITORY } from 'src/auth/patronAdapter/auth.interface.repository';


@Injectable()
export class ObraService {
    constructor(
        @Inject(IOBRA_REPOSITORY) private iobraRepository:IObraRepository,
        @Inject(IAUTH_REPOSITORY) private authRepository:IAuthRepository,
        private readonly jwtService:JwtService,
        private readonly googleDriveService: GoogleDriveService,
    ){}
    
    async creaObra(body: any):Promise<ObraEntity> 
    {
        const jwt = body.autorization.replace('Bearer ', '');   
        const usuarioLogin:string | { [key: string]: any; } = this.jwtService.decode(jwt) 
        const usuarioId = usuarioLogin['id']

        
        const obraId = await this.iobraRepository.buscaObraByusuarioIdAndObraId({usuarioId:usuarioId})
        console.log({"resultado de buscar obraid":obraId})
        
        
        if(obraId === null){ //en caso de no encontrar, crear una obra nueva.
            //encontrar el id de la carpeta del usuario registrado, crear una carpeta dentro de esta llamada logo
            const folderPadreId = await this.authRepository.findOne({email:usuarioLogin["email"]})
            const folderIdLogo = await this.creaCarpeta(folderPadreId.usuarioFolderId,"logo")
            const logoUrl = await this.subeImagenADrive(body.file,folderIdLogo)
            const obra = await  this.iobraRepository.creaObra({"usuarioId":usuarioId,"logoUrl":logoUrl,"obraFolderId":""})
            const obraFolderId = await this.creaCarpeta(folderPadreId.usuarioFolderId,obra.obraId)
            await this.actualizaFolderId(obra.obraId,obraFolderId)

           return obra
        }
        //en caso que lo encuentre, retornar
        

        
        
    }
    async creaCarpeta(folderadreId:string,nombreCarpeta:string){
        return await this.googleDriveService.crearCarpeta(folderadreId,nombreCarpeta)
    }
    async subeImagenADrive(file:Express.Multer.File,idForGoogleElement: string){

        return await this.googleDriveService.subirImagen(file,idForGoogleElement)
    }

    async buscaObraByIdObra(obraId:string ): Promise<ObraEntity> {
        const  entityFilterQuery: FilterQuery<ObraEntity> = {
            obraId:obraId,
            
        }
        return await this.iobraRepository.buscaObraByObraId(entityFilterQuery.obraId)
    }
    /*async actualizaObra(obraId:string, actualizaObraDto:ActualizaObraDto): Promise<Obra> {
        return await this.iobraRepository.actualizaObra({obraId},actualizaObraDto)
    }*/
    async listaObras(){
        return await this.iobraRepository.listaObras({})
    }
    async buscaObraPorUsuarioId(usuarioId:string){
        
        return await this.iobraRepository.listaObrasPorUsuarioId({usuarioId})

    }
    async actualizaFolderId(obraId:string,obraFolderId:string){
        const body:ObraEntity={
          logoUrl:"",
          obraFolderId,
          obraId,
          usuarioId:""
        }  
        
        return await this.iobraRepository.actualizaFolderId(body,{obraFolderId})
  
      }
   
   
}

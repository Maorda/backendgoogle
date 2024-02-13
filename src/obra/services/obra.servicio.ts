import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreaObraDto, listaObrasPorUsuarioIdDto } from '../dtos/crud.obra';
import { Obra } from '../entities/obra.entity';
import { IObraRepository, IOBRA_REPOSITORY } from '../patronAdapter/obra.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class ObraService {
    constructor(
        @Inject(IOBRA_REPOSITORY) private iobraRepository:IObraRepository,
        private readonly jwtService:JwtService
    ){}
    
    async creaObra(body: any): Promise<Obra> {
        
        
        //const jwt = req.headers.authorization.replace('Bearer ', '');
        //const credentials:any = this.jwtService.decode(jwt,{json:true,complete:true});// sirve para sacer el email y el id, combiene la busqieda por id.
        

        //debe buscar dado un usuario, encontrar la obra a la que se relaciona el archivo excel
        
        const obraId = await this.iobraRepository.buscaObraByusuarioIdAndObraId({usuarioId:body.obraId})
        console.log({"resultado de ":obraId})
        
        if(obraId === null){ //en caso de no encontrar, crear una obra nueva.
            
            return await  this.iobraRepository.creaObra({"usuarioId":body.usuarioId,"logoUrl":body.logoUrl})
        }
        //en caso que lo encuentre, retornar
        

        
        
    }

    async buscaById(obraId:string ): Promise<Obra> {
        return await this.iobraRepository.buscaById({obraId})
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
}

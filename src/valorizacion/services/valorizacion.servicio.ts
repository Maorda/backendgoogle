import { Inject, Injectable } from '@nestjs/common';
import { CreateValorizacionDto, ActualizaValorizacionDto, AgregaevidenciafotograficaDto } from '../dtos/crud.valorizacion.dto';
import { JwtService } from '@nestjs/jwt';
import { Valorizacion } from '../entities/valorizacion.entity';
import { IVALORIZACION_REPOSITORY, IValorizacionRepository } from '../patronAdapter/valorizacion.interface';
import { jwtConstants } from 'src/constants/constants';
import { HttpService } from "@nestjs/axios";
import * as fs from 'fs'
import  * as path from 'path';

import { map, tap } from 'rxjs/operators';
import { GoogleDriveService } from 'src/managerdrive/services/googleDriveService';
//import { ITitulo_subtitulo } from 'src/toolbox/forValorizacion/generaSeparadores';

@Injectable()
export class ValorizacionService {
    constructor(
        @Inject(IVALORIZACION_REPOSITORY) private ivalorizacionRepository:IValorizacionRepository,    
        private jwtService: JwtService,
        private http:HttpService,
        private readonly googleDriveService: GoogleDriveService,

    ){}

    async creaperiodovalorizacion(creaValorizacionDto: CreateValorizacionDto): Promise<Valorizacion> {
        return await  this.ivalorizacionRepository.creaperiodovalorizacion(creaValorizacionDto)
    }

    async buscaById(obraId:string ): Promise<Valorizacion> {
        return await this.ivalorizacionRepository.buscaById({obraId})
    }

    async buscaValoByObraId(obraId:string ): Promise<Valorizacion> {
        return await this.ivalorizacionRepository.buscaValorizacionByObraId({obraId})
    }

    async actualizaValorizacion(obraId:string, actualizaObraDto:ActualizaValorizacionDto): Promise<Valorizacion> {
        return await this.ivalorizacionRepository.actualizaValorizacion({obraId},actualizaObraDto)
    }

    async listaValorizaciones(){
        return await this.ivalorizacionRepository.listaValorizaciones({})
    }
    async subeImagenADrive(file:Express.Multer.File,idForGoogleElement: string){
        return await this.googleDriveService.subirImagen(file,idForGoogleElement)
    }

    async agregaevidenciafotografica(evidenciaFotografica:AgregaevidenciafotograficaDto):Promise<AgregaevidenciafotograficaDto>{
        
        
        const macho:any = await this.ivalorizacionRepository.agregaevidenciafotografica(evidenciaFotografica) 
        
        return macho
    }

    async validateToken(token:string):Promise<string>{
        console.log(token)
        const verify = this.jwtService.verify(token.split(" ",2)[1],jwtConstants)
        return await verify.id
    }
    
    async dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId,mesSeleccionado)
    }
    async actualizaEvidenciaFotografica(evidenciaFotografica:AgregaevidenciafotograficaDto){
        return await this.ivalorizacionRepository.actualizaEvidenciaFotografica(evidenciaFotografica)
    }
    //llamadas a pandas
    /*async calculoVertical(){
        return this.http.post('http://127.0.0.1:8000/hola/valores', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );
    }*/
    async  llamaAPandas() {
        const data = {
            'ID': [1, 2, 3, 4, 5],
            'Name': ['Car A', 'Car B', 'Car C', 'Car D', 'Car E'],
            'Price': [25000, 30000, 35000, 40000, 45000]}

        return this.http.post('http://127.0.0.1:8000/hola/valores', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );

        
    }

    async  valorizacion(data:any) {
        
       

        return this.http.post('http://127.0.0.1:8000/hola/valorizacion', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );
    
    }
  

}


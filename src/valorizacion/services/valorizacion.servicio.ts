import { Inject, Injectable } from '@nestjs/common';
import { CreateValorizacionDto, ActualizaValorizacionDto, AgregaevidenciafotograficaDto, ActualizaValorizacionFolderIdDTO } from '../dtos/crud.valorizacion.dto';
import { JwtService } from '@nestjs/jwt';
import { ValorizacionEntity } from '../entities/valorizacion.entity';
import { IVALORIZACION_REPOSITORY, IValorizacionRepository } from '../patronAdapter/valorizacion.interface';
import { jwtConstants } from 'src/constants/constants';
import { HttpService } from "@nestjs/axios";
import * as fs from 'fs'
import  * as path from 'path';

import createReport from 'docx-templates';


import { map, tap } from 'rxjs/operators';
import { GoogleDriveService } from 'src/managerdrive/services/googleDriveService';
import { IObraRepository, IOBRA_REPOSITORY } from 'src/obra/patronAdapter/obra.interface';
import { FilterQuery } from 'mongoose';
import { ObraEntity } from 'src/obra/entities/obra.entity';
import { firstValueFrom } from 'rxjs';
import { GoogleDocService } from 'src/managerdrive/services/googleDocService';
//import { ITitulo_subtitulo } from 'src/toolbox/forValorizacion/generaSeparadores';

@Injectable()
export class ValorizacionService {
    constructor(
        @Inject(IVALORIZACION_REPOSITORY) private ivalorizacionRepository:IValorizacionRepository,
        @Inject(IOBRA_REPOSITORY) private iobraRepository:IObraRepository, 
        private jwtService: JwtService,
        private http:HttpService,
        private readonly googleDriveService: GoogleDriveService,
        protected readonly googleDocService:GoogleDocService,
        private readonly httpService : HttpService

    ){}

    async creaperiodovalorizacion(creaValorizacionDto: CreateValorizacionDto): Promise<ValorizacionEntity> {
        return await  this.ivalorizacionRepository.creaperiodovalorizacion(creaValorizacionDto)
    }

    async buscaById(obraId:string ): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.buscaById({obraId})
    }

    async buscaValoByObraId(obraId:string ): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.buscaValorizacionByObraId({obraId})
    }

    async actualizaValorizacion(obraId:string, actualizaObraDto:ActualizaValorizacionDto): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.actualizaValorizacion({obraId},actualizaObraDto)
    }

    async actualizaValorizacionFolderId(actualizaValorizacionFolderIdDTO: ActualizaValorizacionFolderIdDTO){
        
        return await this.ivalorizacionRepository.actualizaValorizacionFolderId(actualizaValorizacionFolderIdDTO)
    }

    async listaValorizaciones(){
        return await this.ivalorizacionRepository.listaValorizaciones({})
    }
    async subeImagenADrive(file:Express.Multer.File,idForGoogleElement: string){
        return await this.googleDriveService.subirImagen(file,idForGoogleElement)
    }
    async creaCarpetaDrive(carpetaContenedora:string,nombrecarpeta:string){
        return await this.googleDriveService.crearCarpeta(carpetaContenedora,nombrecarpeta)
    }

    async agregaevidenciafotografica(evidenciaFotografica:AgregaevidenciafotograficaDto):Promise<AgregaevidenciafotograficaDto>{
        
        const macho:any = await this.ivalorizacionRepository.agregaevidenciafotografica(evidenciaFotografica) 
        
        return macho
    }
    async showPicture(fileId:string){
        const fileid= "1llt9PCpU6Wlm97Y9GyIS1QpxOPPBuRtg"
        return await this.googleDriveService.obtenerwebViewLink(fileid)
    }
    async buscaObraById(obraId:string){
        const  entityFilterQuery: FilterQuery<ObraEntity> = {
            obraId
            
        }

        return await this.iobraRepository.buscaObraByObraId(entityFilterQuery)
    }

    async validateToken(token:string):Promise<string>{
        console.log(token)
        const verify = this.jwtService.verify(token.split(" ",2)[1],jwtConstants)
        return await verify.id
    }
    
    async dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId,mesSeleccionado)
    }
    async buscaMesSeleccionadoFolderIdPorMesSeleccionado(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.buscaMesSeleccionadoFolderIdPorMesSeleccionado(obraId,mesSeleccionado)
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
    async listaFotosSegunObraMesSeleccionado(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.listaFotosSegunObraMesSeleccionado(obraId,mesSeleccionado) 

    }
    public returnresponsetypeservice(){
        return  this.httpService.get('http://localhost:3000/valorizacion/creadocumentopanelfotografico',{responseType:'arraybuffer'})

    }
    public async plantillaDocxV3(){
        const valores:any[] = []
        let payload:any
        let carpetaContenedoraId:string
        let iterable:any[] = []
        let funcs:any[] = []
        let joder:any
        let evidenciasFotograficasId:any[]=[]
        try {
          
            payload = await this.buscaMesSeleccionadoFolderIdPorMesSeleccionado('65d91ea6cc44ee97bd625b0d','Diciembre')
            carpetaContenedoraId = payload.periodos[0].mesSeleccionadoFolderId;
            evidenciasFotograficasId = payload.periodos[0].panelFotografico.map((evidenciaFotografica:any,index:number)=>
                    {
                        return evidenciaFotografica.urlFoto.split('&id=',2)[1];
                    })
         

            const funcs = evidenciasFotograficasId.map(url => () => this.googleDriveService.descargaImagenArrayBuffer(url))
            /*
            * serial executes Promises sequentially.
            * @param {funcs} An array of funcs that return promises.
            * @example
            * const urls = ['/url1', '/url2', '/url3']
            * serial(urls.map(url => () => $.ajax(url)))
            *     .then(console.log.bind(console))
            */
            const serial = funcs =>
            funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))

            serial(funcs)
            .then(async(val:any[])=>{
                
                val.map((myval,index)=>{
                    valores.push({
                        nro: `Fotografía N° ${index + 1}`,
                        partida:"imagename.partida",
                        descripcion:"imagename.descripcion",
                        foto:{
                            data:myval.data,
                            extension:".jpeg",
                            height:9,
                            width:9
                        }
                    })
                })
                console.log(valores)
           firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=1vS6zPLqOmjdv3Ep6HyXF4sB25_DshhHz`,{responseType:'arraybuffer'}))//copia la plantilla
          .then(async (arrayBuffer)=>{
            
            let template = Buffer.from(arrayBuffer.data,'binary')
            
            const buffer1 = await createReport({//reemplaza los valores segun plantilla
              template,
              data:{valores}
            });
    
            this.googleDocService.creaDocumento(buffer1,"panel fotografico",carpetaContenedoraId)//crea un nuevo archivo en google, con la plantilla reemplazada
    
          })


            })
            

            
            
            
            
           
           
            
        

            
          
         
           
            
                    
                 /*    firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=1vS6zPLqOmjdv3Ep6HyXF4sB25_DshhHz`,{responseType:'arraybuffer'}))//copia la plantilla
          .then(async (arrayBuffer)=>{
            
            let template = Buffer.from(arrayBuffer.data,'binary')
            
            const buffer1 = await createReport({//reemplaza los valores segun plantilla
              template,
              data:{valores}
            });
    
            this.googleDocService.creaDocumento(buffer1,"panel fotografico",carpetaContenedoraId)//crea un nuevo archivo en google, con la plantilla reemplazada
    
          })*/

         
            
          
           
                
                
          //console.log({"iterable":iterable})
          
          
          //const { data: valorizacionPanelFotograficoBuffer} = await firstValueFrom(this.httpService.get(user.picture.large, {responseType: 'arraybuffer'}));//combierte la url de tipo string a buffer
          //
          /*firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=1vS6zPLqOmjdv3Ep6HyXF4sB25_DshhHz`,{responseType:'arraybuffer'}))//copia la plantilla
          .then(async (arrayBuffer)=>{
            
            let template = Buffer.from(arrayBuffer.data,'binary')
            
            const buffer1 = await createReport({//reemplaza los valores segun plantilla
              template,
              data:{valores}
            });
    
            this.googleDocService.creaDocumento(buffer1,"panel fotografico",carpetaContenedoraId)//crea un nuevo archivo en google, con la plantilla reemplazada
    
          })*/
           
        } catch (error) {
          
        }
    
      }
      
  

}
function getInSequence(array, asyncFunc) {
    return array.reduce((previous, current) => (
      previous.then(accumulator => (
        asyncFunc(current).then(result => accumulator.concat(result))
      ))
    ), Promise.resolve([]));
  }
function asyncFunc(e) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(e), e * 1000);
    });
  }
let final = [];

function workMyCollection(arr) {
    return arr.reduce((promise, item) => {
      return promise
        .then((result) => {
          // help you to understand what's result
          console.log(`A: result ${result}, item ${item}`)
          return asyncFunc(item).then(result => {
            final.push(result)
            // print result and item
            console.log(`B: result ${result}, item ${item}`)
            // add a new return value
            return result + " Done"
          })
        })
        .catch(console.error)
    }, Promise.resolve())
  }

  function promiseMap(inputValues, mapper) {
    const reducer = (acc$, inputValue) =>
      acc$.then(acc => mapper(inputValue).then(result => acc.push(result) && acc));
    return inputValues.reduce(reducer, Promise.resolve([]));
  }
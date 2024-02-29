import { HttpService } from '@nestjs/axios';
import {  Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GoogleDocService } from './managerdrive/services/googleDocService';
import { GoogleDriveService } from './managerdrive/services/googleDriveService';

import * as fs from 'fs'
import createReport from 'docx-templates';


export interface foto{
  data: Buffer,
  width: 11,
  height: 11,
  extension: ".png" | ".jpg" | "jpeg",
}
export interface user{
 name:string;
 avatar:foto;
}
export interface IEvidenciaFotografica{
  descripcion:string;
  foto:foto;
}
export interface joder{
  valores:IEvidenciaFotografica[]
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly googleDocService:GoogleDocService,
    private readonly httpService : HttpService

    ) {}
    public async agregaPermiso(idForGoogleElement:string): Promise<any[]>{
      try {
        return await this.googleDriveService.compartirCarpeta(idForGoogleElement)
      } catch (e) {
        throw new Error(e);
      }
    }

  public async subirImagen(file: Express.Multer.File,idForGoogleElement:string): Promise<string> {
    try {
      const link = await this.googleDriveService.subirImagen(file,idForGoogleElement);
      // do something with the link, e.g., save it to the database
      
      return link;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async obtenerwebViewLink(fileId: string): Promise<string> {
    try {
      const link = await this.googleDriveService.obtenerwebViewLink(fileId);
      // do something with the link, e.g., return it to the user
      return link;
    } catch (e) {
      throw new Error(e);
    }
  }
  public async crearCarpeta(idForGoogleElement:string,nameForGoogleElement:string){
    try{
      await this.googleDriveService.crearCarpeta(idForGoogleElement,nameForGoogleElement)//carpeta logos

    }catch (e){
      throw new Error(e);

    }
  }
  public async buscaReemplaza(){
    try{
      const idCopia = await this.googleDocService.creaCopia('1hXE80EcY-ZiY3WHN0OkJZzR_iD3d5-n1-_4jGEIM8Zs',"my copia",'1B3aTsga8DljMwFO-d5djpi4E-S5h_8os')//1-Lenn5pGOvFa8lDeLDShsci8CM1g_JxquZhQJwj6c1s
      const cambiado = await this.googleDocService.buscaReemplaza(["<nombre>","<apellido>"],["dante","manrique"],idCopia)
     

    }catch (e){
      throw new Error(e);

    }
  }
  public async plantillaDocx(documentId,data:any){
    /*try {
      
      firstValueFrom(
        this.httpService.get(`https://drive.google.com/uc?export=download&id=${documentId}`,{responseType:'arraybuffer'})
      )
      .then(async(arrayBuffer)=>{//obtiene un array buffer de la plantilla
       
        let template = Buffer.from(arrayBuffer.data,'binary')
      
        const buffer1 = await createReport({//reemplaza los valores segun plantilla
          template,
          data
        });
      
        this.googleDocService.creaDocumento(buffer1)//crea un nuevo archivo en google, con la plantilla reemplazada

      })
  
    } catch (error) {
     console.error(error)
      
    }*/
   
    
  }
  public async plantillaDocxV2(config:{idusuario:number,idobra:number,nrovalorizacion:number,mesvalorizacion:string},documentId:string){
    /*try {
      //axios.get, siempre devuelve una respuesta con data.
      const { data:{"results": [user]}} = await firstValueFrom(this.httpService.get('https://randomuser.me/api'));//obtiene los datos de tipo string
      const {data: userAvatarBuffer} = await firstValueFrom(this.httpService.get(user.picture.large, {responseType: 'arraybuffer'}));//combierte de string a buffer
      firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=${documentId}`,{responseType:'arraybuffer'}))//copia la plantilla
      .then(async (arrayBuffer)=>{
        user.avatar = {
          data: userAvatarBuffer,
          width: 6,
          height: 6,
          extension: '.jpg',
        };
        console.log(user)
        let template = Buffer.from(arrayBuffer.data,'binary')
        const buffer1 = await createReport({//reemplaza los valores segun plantilla
          template,
          data:user
        });

        this.googleDocService.creaDocumento(buffer1)//crea un nuevo archivo en google, con la plantilla reemplazada

      })
       
    } catch (error) {
      
    }*/

  }
  public async plantillaDocxV3(){
    /*try {
      //axios.get, siempre devuelve una respuesta con data.
      const { data:{"results": [user]}} = await firstValueFrom(this.httpService.get('https://randomuser.me/api'));//obtiene los datos de tipo string
      
      
      const { data: userAvatarBuffer} = await firstValueFrom(this.httpService.get(user.picture.large, {responseType: 'arraybuffer'}));//combierte la url de tipo string a buffer
      
      firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=15FXCr7FAAA_bz_-LaIFtPx-dIVnVmFqq`,{responseType:'arraybuffer'}))//copia la plantilla
      .then(async (arrayBuffer)=>{
        user.avatar = {
          data: userAvatarBuffer,
          width: 6,
          height: 6,
          extension: '.jpg',
        };
        console.log(user)
        let template = Buffer.from(arrayBuffer.data,'binary')
        const buffer1 = await createReport({//reemplaza los valores segun plantilla
          template,
          data:user
        });

        this.googleDocService.creaDocumento(buffer1)//crea un nuevo archivo en google, con la plantilla reemplazada

      })
       
    } catch (error) {
      
    }*/

  }
  public async comprimeDescargaCarpeta(idForGoogleElement:string){
    
    try {
      return await this.googleDriveService.descargaTodosLosArchivosCarpeta(idForGoogleElement)
      
    } catch (error) {
      console.error(error)
    }
    
  }
  public async listaLosIdsEnCarpeta(idForGoogleElement:string){
    try {
      return await this.googleDriveService.getChildfilesIdIndFolder(idForGoogleElement)
      
    } catch (error) {
      console.error(error)
    }
    
  }
  
 

}

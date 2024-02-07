import { Injectable } from '@nestjs/common';
import { GoogleDocService } from './managerdrive/services/googleDocService';
import { GoogleDriveService } from './managerdrive/services/googleDriveService';



@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly googleDocService:GoogleDocService

    ) {}

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
      console.log(cambiado)

    }catch (e){
      throw new Error(e);

    }
  }
}

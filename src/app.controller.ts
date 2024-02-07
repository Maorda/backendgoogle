import { Controller, Get, Post, UseGuards,Request, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { GoogleDriveService } from './managerdrive/services/googleDriveService';



@Controller("googleDrive")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Post("subeimagen")
  @UseInterceptors(
    FileInterceptor('file')
  )
  async getHello(
    @UploadedFile() file:Express.Multer.File,
    @Body() idForGoogleElement: string
    
  ) {
    return await this.appService.subirImagen(file,idForGoogleElement)
    //return this.appService.getHello();
  }

  @Post('muestraimagen')
  async muestraimagen(
    @Body() idForGoogleElement:string
  ){
    return await this.appService.obtenerwebViewLink(idForGoogleElement)
  }

  @Post('crearcarpeta')
  async crearCarpeta(
    @Body() idForGoogleElement:string,
    @Body() nameForGoogleElement:string
  ){
    return await this.appService.crearCarpeta(idForGoogleElement,nameForGoogleElement)
  }
  @Post('buscareemplaza')
  async buscaReemplaza(){
    return await this.appService.buscaReemplaza()

  }
  
}

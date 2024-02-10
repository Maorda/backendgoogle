import { Controller, Get, Post, UseGuards,Request, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller("googleDrive")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
  @Get('saludo')
  saludo(){
    console.log("mostrando mensaje en la consola")
    return "hola"
  }
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
    console.log(idForGoogleElement)
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
  @Post('docx')
  async docx(){
    return await this.appService.plantillaDocx()

  }

  
  
}

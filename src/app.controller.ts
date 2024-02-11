import { Controller, Get, Post, UseGuards,Request, UploadedFile, Body, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller("googleDrive")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
  @Get('saludo')
  saludo(  ){
    console.log("mostrando mensaje en la consola")
    return "hola como estas"
  }
  @Get('saludopersona')
  otrosaludo(){
    return "otro saludo"
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

  @Get('muestraimagen/:idForGoogleElement')
  async muestraimagen(
    @Param() idForGoogleElement:string
  ){
    console.log(idForGoogleElement)
    return idForGoogleElement//await this.appService.obtenerwebViewLink(idForGoogleElement)
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
  
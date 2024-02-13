import { Controller, Get, Post, UseGuards,Request, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';


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
    @Body("idForGoogleElement") idForGoogleElement: string
    
  ) {
   
    return await this.appService.subirImagen(file,idForGoogleElement)
    
  }
  @Get('agregaPermiso')
  async agregaPermiso(){
    return await this.appService.agregaPermiso('126Ae5Q9qRnMz_FVGjP1WY-TiAYZ3K0Qx')
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
  @Post('docx')
  async docx(){
    const data =  {
      foto:'https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-logo.png',
      name: 'John',
      surname: 'Appleseed',
      
    }
    return await this.appService.plantillaDocx('15FXCr7FAAA_bz_-LaIFtPx-dIVnVmFqq',data)

  }
  @Post('docxv2')
  async docxv2(){
        
        
        
        //para generar el documento en word del panel fotografico se necesita de los siguientes parametros
        //- idusuario
        //- idobra
        //- nro valorzacion
        //- mes valorizacion
         
       const config = {
        
        idusuario:1,
        idobra:1,
        nrovalorizacion:0,
        mesvalorizacion:'diciembre'
       }

        return await this.appService.plantillaDocxV2(config,'15FXCr7FAAA_bz_-LaIFtPx-dIVnVmFqq')

        

  }
  
}

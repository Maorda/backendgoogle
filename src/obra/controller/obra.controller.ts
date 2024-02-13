import { Body, Controller, Get, Param, UseInterceptors, Post, Res,Req,UploadedFile,Headers, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { parametros } from 'src/constants/configGlobal';
import { listaObrasPorUsuarioIdDto } from '../dtos/crud.obra';
import { Obra } from '../entities/obra.entity';
import { ObraService } from '../services/obra.servicio';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs'
import { JwtService } from '@nestjs/jwt';

@Controller('obra')
export class ObraController {
    constructor(
        private obraService:ObraService,
        private jwtService: JwtService,
    ){}
    @Get('listaobras')
    async getObras(): Promise<Obra[]> {
        return this.obraService.listaObras();
    }
    
    @Get(':usuarioId')
    async getObraByUserId(
        @Param('usuarioId') otrousuarioId: string,
        ): Promise<Obra[]> {

      return this.obraService.buscaObraPorUsuarioId(otrousuarioId );
    }  
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            async destination(req, file, callback) {
                const filePath = (`./uploads/cabeceras`)// por motivos que pictures:filename es afectado, se cambiará la ruta
                //const filePath = (`./uploads/todaslasfotos`)
                //se necesita crear la carpeta a mano
                await fs.promises.mkdir(`${filePath}`,{recursive:true})
                //callback(null,`./uploads`)
                callback(null,`${filePath}`)
            },//: ,//`${_}./uploads`,
            filename: ( req, file, cb)=>{
                const name = file.mimetype.split("/");
                const newFileName = name[0].split(" ").join("_")+Date.now()+'.png';//garantizar que la imagen ternga la extencion png, al momento de generar la cabecera de excel
              cb(null, newFileName)
            },
          }),
         fileFilter: (req,file,cb)=>{
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(null,false)
            }
            cb(null,true)
         },
        }),
      )
    @Post('crea')
    createObra(
      
      @UploadedFile() file:Express.Multer.File,
      @Body() agregaObra:any,
      @Headers('authorization') autorization:string//interceptada por medio de LoggingInterceptor la cabecera que trae el token
      ): Promise<any> {
        
        if(!file){
          throw new BadRequestException("file is not a imagen")
        }
        const usuarioLogin:string | { [key: string]: any; } = this.jwtService.decode(autorization) 
        const usuarioId = usuarioLogin["id"]
      
        const response = {
           filePath:`https://192.168.1.86:3033/obra/logocabecera/${file.filename}`
          
        };
        
        
        const body = {
          usuarioId,
          obraId:agregaObra.obraId,
          logoUrl : response.filePath
        }

            
        return this.obraService.creaObra(body)
        
    }
    @Get('logocabecera/:filename')
    async getPicture(
      //  @Param('usuarioid') usuarioid:any,
        @Param('filename') filename:any, 
        @Res() res:Response,
        
    ){
    //necesitas cargar desde aca lo necesario para que path file name no dependa  de agrgarevidenciafotografica
    
     const filePath = `./uploads/cabeceras`
            
        res.sendFile(filename,{root:`${filePath}`})
    }

    @Get('plantilla/descargaplantilla')//funciona
    downloadTemplateFileXls(@Res() ponse: Response):string{

        ponse.download(`${parametros.obra.templates.base}${parametros.obra.templates.configuracion}`)
        return "ARCHIVO DESCARGADO" 
    
    }
    
}

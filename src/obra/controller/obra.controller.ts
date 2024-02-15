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
        FileInterceptor('file')
      )
    @Post('crea')
    async createObra(
      
      @UploadedFile() file:Express.Multer.File,
      @Body() agregaObra:any,
      @Headers('authorization') autorization:string//interceptada por medio de LoggingInterceptor la cabecera que trae el token
      ): Promise<any> {
        
        if(!file){
          throw new BadRequestException("file is not a imagen")
        }
        const tmp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzMyMTgzMzBiNmRjMGUxZDIzYmE5MCIsImVtYWlsIjoidW5vIiwiaWF0IjoxNzA4MDEzNjM4LCJleHAiOjE3MDgxMDAwMzh9.KnEAk_jS2XxhSXL1qolCccrzcv5Qfdax1wV_7L3ZXCg'
        const usuarioLogin:string | { [key: string]: any; } = this.jwtService.decode(tmp) 
        const usuarioId = usuarioLogin["id"]
        const filePathInDrive = await this.obraService.subeImagenADrive(file,agregaObra.idForGoogleElement)
       
        
        
        const body = {
          usuarioId,
          obraId:agregaObra.obraId,//devuelve null en caso no se tenga ninguna obra
          logoUrl : filePathInDrive
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

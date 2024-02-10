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
    return "hola"
  }

  
  
}

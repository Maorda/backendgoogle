import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ManagerGoogleDriveService } from './managerdrive/managerdriveservice/managerdriveservice.service';

@Controller("googleDrive")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly managerDriveService:ManagerGoogleDriveService
    ) {}

  @Post("creaCarpeta")
  async getHello() {
    return await this.managerDriveService.createFolder("holaf")
    //return this.appService.getHello();
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerdriveModule } from './managerdrive/managerdrive.module';
import { ManagerGoogleDriveService } from './managerdrive/managerdriveservice/managerdriveservice.service';

@Module({
  imports: [ManagerdriveModule],
  controllers: [AppController],
  providers: [AppService,ManagerGoogleDriveService],
})
export class AppModule {}

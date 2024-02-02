import { Module } from '@nestjs/common';
import { ManagerGoogleDriveService } from './managerdriveservice/managerdriveservice.service';

@Module({
  providers: [
    ManagerGoogleDriveService
  ],
  exports:[ManagerGoogleDriveService]
})
export class ManagerdriveModule {}

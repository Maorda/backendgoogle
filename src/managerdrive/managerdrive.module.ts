import { Module } from '@nestjs/common';
import { ManagerdriveserviceService } from './managerdriveservice/managerdriveservice.service';

@Module({
  providers: [ManagerdriveserviceService]
})
export class ManagerdriveModule {}

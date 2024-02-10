import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyAuthGoogleDriveModule } from './managerGoogle/AuthGoogleDrive.module';


@Module({
  imports: [
    MyAuthGoogleDriveModule
  ],
  controllers: [AppController],
  providers: [AppService,
   // GoogleDriveService
  ],
})
export class AppModule {}

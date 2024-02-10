import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    
   
  ],
  controllers: [AppController],
  providers: [AppService,
   // GoogleDriveService
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerdriveModule } from './managerdrive/managerdrive.module';

@Module({
  imports: [ManagerdriveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

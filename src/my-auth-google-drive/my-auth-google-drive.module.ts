import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleDocServiceService } from './services/GoogleDoc.Service';
import { GoogleDriveService } from './services/GoogleDrive.Service';
import { GoogleAutenticarService } from './services/GoogleDriveAutenticar.Service';
@Module({
    imports:[HttpModule],
    providers: [GoogleDocServiceService,GoogleDriveService,GoogleAutenticarService]
})
export class MyAuthGoogleDriveModule {

}

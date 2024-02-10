import { HttpModule } from '@nestjs/axios';
import { Module,DynamicModule } from '@nestjs/common';
import { GoogleDocService } from './services/GoogleDoc.Service';
import { GoogleDriveService } from './services/GoogleDrive.Service';
import { GoogleAutenticarService } from './services/GoogleDriveAutenticar.Service';
import { GoogleDriveConfig } from './types/googleDriveConfig';
import { EFOLDERSIDS } from './services/const';
@Module({
    //imports:[HttpModule],
    //providers: [GoogleDocService,GoogleDriveService,GoogleAutenticarService]
})
export class MyAuthGoogleDriveModule {
     /**
   *
   * @param googleDriveConfig your config file/all config fields
   * @param googleDriveFolderId your Google Drive folder id
   */
  static register(
    googleDriveConfig: GoogleDriveConfig,
  

    googleDriveBaseFolderId: string,//carpeta base en donde se lojara todos los archivos de los usuarios
    //googleDriveLogosFolderId: string,//carpeta donde se alojará el logo del usuario
    //googleDriveArchivosFolderId: string,//carpeta donde se alojara toda la gestion documentaria del usuario
  ): DynamicModule {
    return {
      module: MyAuthGoogleDriveModule,
      global: true,
      providers: [
        GoogleAutenticarService,
        GoogleDriveService,
        GoogleDocService,
        { provide: EFOLDERSIDS.CONFIG, useValue: googleDriveConfig },
       
        { provide: EFOLDERSIDS.FOLDERBASEID, useValue: googleDriveBaseFolderId },
        
      ],
      exports: [
        GoogleAutenticarService,
        GoogleDriveService,
        GoogleDocService,
        { provide: EFOLDERSIDS.CONFIG, useValue: googleDriveConfig },
     
        { provide: EFOLDERSIDS.FOLDERBASEID, useValue: googleDriveBaseFolderId },
      
      ],
    };
  }

}

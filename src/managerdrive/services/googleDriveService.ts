import { Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Readable } from 'stream';

import { GoogleAutenticarService } from './googleAntenticarService';


@Injectable()
export class GoogleDriveService extends GoogleAutenticarService {

public async crearCarpeta(idForGoogleElement:string,nameForGoogleElement:string){
  const fileMetadata = {
    name: nameForGoogleElement,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [idForGoogleElement]
  };
  try {
    const file = await this.drive.files.create({
     resource: fileMetadata,
      fields: 'id',
    });
    console.log('Folder Id:', file.data.id);
    return file.data.id;
  }catch (err) {
  // TODO(developer) - Handle error
    throw err;
  }

    
  
  }
  public async compartirCarpeta(idForGoogleElement:string,targetUserEmail:string = 'uploadsad@sadsinfactura.iam.gserviceaccount.com'){
    const service = this.drive;
  const permissionIds = [];

  const permissions = [
    {
      type: 'user',
      role: 'writer',
      emailAddress: targetUserEmail, // 'user@partner.com',uploadsad@sadsinfactura.iam.gserviceaccount.com.
    },
    /*{
      type: 'domain',
      role: 'writer',
      domain: targetDomainName, // 'example.com',
    }*/,
  ];
  // Note: Client library does not currently support HTTP batch
  // requests. When possible, use batched requests when inserting
  // multiple permissions on the same item. For this sample,
  // permissions are inserted serially.
  for (const permission of permissions) {
    try {
      const result = await service.permissions.create({
        resource: permission,
        fileId: idForGoogleElement,
        fields: 'id',
      });
      permissionIds.push(result.data.id);
      console.log(`Inserted permission id: ${result.data.id}`);
    } catch (err) {
      // TODO(developer): Handle failed permissions
      console.error(err);
    }
  }
  return permissionIds;
  }
  

  /**
   *
   * @param file your upload file like mp3, png, jpeg etc...
   * @return link link four your file on Google Drive
   */
  public async subirImagen(file: Express.Multer.File,idForGoogleElement:string): Promise<string> {
    
    try {
      
      const { originalname, buffer } = file;

      const fileBuffer = Buffer.from(buffer);

      const media = {
        mimeType: file.mimetype,
        body: Readable.from([fileBuffer]),
      };

      const driveResponse = await this.drive.files.create({
        requestBody: {
          name: originalname,
          mimeType: file.mimetype,
          parents: [idForGoogleElement],
        },
        media: media,
      });

      const fileId = driveResponse.data.id;
      //almacenar en la base de datos
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param fileId your file id which you want to get
   */
  public async obtenerwebViewLink(idForGoogleElement:string): Promise<string> {
    try {
      const link =  await this.drive.files.get({
        fileId:idForGoogleElement,
        fields:"webViewLink"
        //, webContentLink"
      })
      console.log(link)
      //buscar en la base de datos

      
      return `${link}`;
    } catch (e) {
      throw new Error(e);
    }
    
  
  
  }
  
    
   
}

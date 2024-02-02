import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import  * as path from 'path';
import { Request, Response } from 'express';
const { google } = require('googleapis');
type PartialDriveFile = {
    id: string;
    name: string;
  };
  
  type SearchResultResponse = {
    kind: 'drive#fileList';
    nextPageToken: string;
    incompleteSearch: boolean;
    files: PartialDriveFile[];
  };
interface IArgsClientGoogleDrive {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
    
} 
@Injectable()
export class ManagerdriveserviceService {
  private driveClient:any;
  

  createDriveClient(clientGoogleDrive:IArgsClientGoogleDrive) {
    const client = new google.auth.OAuth2(clientGoogleDrive.clientId, clientGoogleDrive.clientSecret, clientGoogleDrive.redirectUri);

    client.setCredentials({ refresh_token: clientGoogleDrive.refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder(folderName: string): Promise<PartialDriveFile> {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName: string): Promise<PartialDriveFile | null> {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res: { data: SearchResultResponse }) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName: string, filePath: string, fileMimeType: string, folderId?: string) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }
   
}

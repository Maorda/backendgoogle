import { Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { EFOLDERSIDS } from './const';
import { GoogleDriveConfig } from '../types/googleDriveConfig';


@Injectable()
export class GoogleAutenticarService{
  public drive;
  public docs;

  constructor(
    @Inject(EFOLDERSIDS.CONFIG) private config: GoogleDriveConfig,
    @Inject(EFOLDERSIDS.FOLDERBASEID) private googleDriveFolderBaseId: string,
 
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.client_email,
        private_key: this.config.private_key,
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    this.drive = google.drive({ version: 'v3', auth });
    this.docs = google.docs({ version: 'v1', auth })    
  }
}
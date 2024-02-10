import { Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { GoogleDriveConfig } from '../types/GoogleDriveConfig';
import { EFOLDERSIDS } from '../managerdrive.module';
import { HttpService } from "@nestjs/axios";
import  * as path from 'path';
const {GoogleAuth} = require('google-auth-library');

@Injectable()
export class GoogleAutenticarService{
  public drive;
  public docs;
  public script;
  constructor(
    @Inject(EFOLDERSIDS.CONFIG) private config: GoogleDriveConfig,
    //@Inject(EFOLDERSIDS.FOLDERBASEID) private googleDriveFolderBaseId: string,
    private readonly httpService: HttpService
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
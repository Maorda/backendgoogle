import { Inject, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { GoogleDriveConfig } from '../types/GoogleDriveConfig';
import { EFOLDERSIDS } from '../managerdrive.module';

import { GoogleAutenticarService } from './googleAntenticarService';
const {GoogleAuth} = require('google-auth-library');

@Injectable()
export class GoogleDocService extends GoogleAutenticarService { //es el cliente que en sus metodos llamará segun sea el caso a que carpeta se almacenará
  
    public async creaCopia(idForGoogleElement:string,nameForNewFile:string,destinoFolder:string){
        
        try {
            
            const response = await this.drive.files.copy({
                fileId:idForGoogleElement
            });
        
            if (response.status === 200) {
              const newFileId = response.data.id;
              if (nameForNewFile) {
                try {
                  await this.drive.files.update({
                    fileId: newFileId,
                    resource: {
                      name: nameForNewFile
                    },
                    addParents: destinoFolder,
                    
                  });
                } catch (err) {
                  console.error('Failed to rename the file', err);
                }
              }
              return newFileId;
            }
        
            return response;
          }
          catch (err) {
            console.error('Failed to copy doc', err);
          }

    }

    public async insertaImagenCuerpo(webViewLink:string){}
    /**
     *  const finds = ['<DATE>', '<NUMBER>', '<EMPLOYER>', '<EMPLOYER ADDRESS>', '<AMOUNT PAYABLE>'];
        const replaces = ['2020-01-01', '1234', 'Employer Co Ltd', '1 Office Street', String(10,000)];
        await findAndReplaceTextInDoc(newFileId, finds, replaces);
     * @description
     * @param reemplazos 
     * @param busquedas 
     * @param idForGoogleElement 
     * @returns 
     */
    public async buscaReemplaza(reemplazos:Array<any>,busquedas:Array<any>,idForGoogleElement:string){
        let finds = Array.isArray(reemplazos) ? reemplazos : [reemplazos]; //asegura siempre que sean arrays
        let replaces = Array.isArray(busquedas) ? busquedas : [busquedas]; //asegura siempre que sean arrays
        try {
            
            const docs = this.docs
        
            let requests = [];
        
            for (let i = 0; i < finds.length; i++) {
              requests.push(
                {
                  replaceAllText: {
                    containsText: {
                      text: finds[i],
                      matchCase: true,
                    },
                    replaceText: replaces[i],
                  },
                }
              );
            }
        
            const res = await docs.documents.batchUpdate({
              documentId:idForGoogleElement,
              resource: {
                requests
              }
            });
        
            return res;
          } catch (err) {
            console.log(err);
          }
    }
    public async insertaImagenCabecera(webViewLink:string){}
   
}
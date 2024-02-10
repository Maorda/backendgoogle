import { Injectable } from '@nestjs/common';
import { GoogleAutenticarService } from './GoogleDriveAutenticar.Service';

@Injectable()
export class GoogleDocService extends GoogleAutenticarService {
    
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

    public async insertaImagenCuerpo(webViewLink:string,idForGoogleElement:string){
      try {
            
        const docs = this.docs
        
    
        /*let requests = [];
    
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
        }*/

       /* let requests = [
          {
          'insertInlineImage': {
              'location': {
                  'index': 1
              },
              'uri':
                  webViewLink,
              'objectSize': {
                  'height': {
                      'magnitude': 50,
                      'unit': 'PT'
                  },
                  'width': {
                      'magnitude': 50,
                      'unit': 'PT'
                  }
              }
          }
      },
      {
        'insertInlineImage': {
            'location': {
                'index': 2
            },
            'uri':
                webViewLink,
            'objectSize': {
                'height': {
                    'magnitude': 50,
                    'unit': 'PT'
                },
                'width': {
                    'magnitude': 50,
                    'unit': 'PT'
                }
            }
        }
    },
    {
      replaceAllText: {
        containsText: {
          text: '<foto>',
          matchCase: true,
        },
        replaceText: 'dantecito\n',
      },
    },
    {
      'insertText': {
          'location': {
              'index': 3,
          },
          'text': "index3\n"
      }
  },
           {
      'insertText': {
          'location': {
              'index': 4,
          },
          'text': "index4\n"
      }
  },
           {
      'insertText': {
          'location': {
              'index': 5,
          },
          'text': "index5\n"
      }
  },
  {
    'insertText': {
      'text': 'sin indice\n',
      'endOfSegmentLocation': {}
    }
  },
  {
    'insertText': {
      'text': 'otra ves sin indice\n',
      'endOfSegmentLocation': {}
    }
  },
  {
    'insertInlineImage': {
        'location': {
            'index': 6        },
        'uri':
            webViewLink,
        'objectSize': {
            'height': {
                'magnitude': 50,
                'unit': 'PT'
            },
            'width': {
                'magnitude': 50,
                'unit': 'PT'
            }
        }
    }
},
{
  "createHeader" : {
    "sectionBreakLocation" : {
        "index" : 0,
    },
    "type" : "DEFAULT",
  },
  'insertText' : {
    'location' : {
        'segmentId' : $headerId,
        'index' : 0,
    },
    'text' : 'sample text for header',
  }

},

{
  updateParagraphStyle: {
    paragraphStyle: {
      namedStyleType: "NORMAL_TEXT",
      alignment: "END",
      direction: "LEFT_TO_RIGHT",
      borderBottom: {
        width: { magnitude: 1.5, unit: "PT" },
        padding: { magnitude: 1, unit: "PT" },
        dashStyle: "SOLID"
      }
    },
    range: { startIndex: 3, endIndex: 4 },
    fields: "namedStyleType,alignment,direction,borderBottom"
  }
}

  
  
  ]*/
  let requests = [{
    "createHeader" : {
      "sectionBreakLocation" : {
          "index" : 0,
      },
      "type" : "DEFAULT",
    }
   }
  ]
 
    
        const res = await docs.documents.batchUpdate({
          documentId:idForGoogleElement,
          requestBody:{requests}
        })


        console.log(res.config.data.requests[0].createHeader.sectionBreakLocation)
        console.log(res.data.replies)//[ { createHeader: { headerId: 'kix.px61a9y43w82' } } ]
let requests1 = [{
  'insertInlineImage': {
    'location': {
      'segmentId' : res.data.replies[0].createHeader.headerId,
        'index': 0
    },
    'uri':
        webViewLink,
    'objectSize': {
        'height': {
            'magnitude': 50,
            'unit': 'PT'
        },
        'width': {
            'magnitude': 50,
            'unit': 'PT'
        }
    }
 }
}
   
]



const res1 = await docs.documents.batchUpdate({
  documentId:idForGoogleElement,
  requestBody:{requests:requests1}
})

        return res;
      } catch (err) {
        console.log(err);
      }

    }
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


    public async insertaImagenCabecera(webViewLink:string,idForGoogleElement:string){
      const docs = this.docs
     try {
      let requests = [{
        "createHeader" : {
          "sectionBreakLocation" : {
              "index" : 0,
          },
          "type" : "DEFAULT",
        }
       }
      ]
     
        
            const res = await docs.documents.batchUpdate({
              documentId:idForGoogleElement,
              requestBody:{requests}
            })
    
    
            //console.log(res.config.data.requests[0].createHeader.sectionBreakLocation)
            //console.log(res.data.replies)//[ { createHeader: { headerId: 'kix.px61a9y43w82' } } ]
    let requests1 = [{
      'insertInlineImage': {
        'location': {
          'segmentId' : res.data.replies[0].createHeader.headerId,
            'index': 0
        },
        'uri':
            webViewLink,
        'objectSize': {
            'height': {
                'magnitude': 50,
                'unit': 'PT'
            },
            'width': {
                'magnitude': 50,
                'unit': 'PT'
            }
        },
     },
      },
      
        {
          'updateParagraphStyle' : {
            'range' : {'startIndex' : 0, 'endIndex' : 1, 'segmentId' : res.data.replies[0].createHeader.headerId},
            'paragraphStyle' : {'alignment' : 'CENTER'},
            'fields' : 'alignment'
            }
         
    
        }
    
           
    ]
    
    
    
    await docs.documents.batchUpdate({
      documentId:idForGoogleElement,
      requestBody:{requests:requests1}
    })
    
            return res;
          } catch (err) {
            console.log(err);
          }
    }

    public async insertaParrafo(parrafo:Array<string>,idForGoogleElement:string){
      const docs = this.docs
      const der = await docs.documents.get({
        documentId:idForGoogleElement
      })
      console.log(der.data.body.content[0].sectionBreak)
      console.log(der.data.body.content[0])
      const requests = []
      parrafo.forEach((p)=>{
        requests.push(
          {
            'insertText': {
              'location': {
                  'index': 4,
              },
              'text': `${p}\n`
          }
          },{
            
              'updateParagraphStyle' : {
                'range' : {'startIndex' : 2, 'endIndex' : p.length},
                'paragraphStyle' : {'alignment' : 'JUSTIFIED'},
                'fields' : 'alignment'
                }
             
        
            
          }
        )

      })

  const res = await docs.documents.batchUpdate({
  documentId:idForGoogleElement,
  resource:{requests}
})
    }

    public async insertaParrafoDocx(parrafo:Array<string>,idForGoogleElement:string){
      
    
   

    //fs.writeFileSync('report.docx', buffer)
  }

    
    
}

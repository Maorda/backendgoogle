import { Inject, Injectable } from '@nestjs/common';
import { CreateValorizacionDto, ActualizaValorizacionDto, AgregaevidenciafotograficaDto, ActualizaValorizacionFolderIdDTO } from '../dtos/crud.valorizacion.dto';
import { JwtService } from '@nestjs/jwt';
import { ValorizacionEntity } from '../entities/valorizacion.entity';
import { IVALORIZACION_REPOSITORY, IValorizacionRepository } from '../patronAdapter/valorizacion.interface';
import { jwtConstants } from 'src/constants/constants';
import { HttpService } from "@nestjs/axios";
import * as fs from 'fs'
import  * as path from 'path';

import createReport from 'docx-templates';
import { AlignmentType, Document, Packer, Paragraph, TextRun, ISectionOptions, patchDocument, PatchType, Alignment, WidthType, convertMillimetersToTwip, ShadingType } from "docx";

import { map, tap } from 'rxjs/operators';
import { GoogleDriveService } from 'src/managerdrive/services/googleDriveService';
import { IObraRepository, IOBRA_REPOSITORY } from 'src/obra/patronAdapter/obra.interface';
import { FilterQuery } from 'mongoose';
import { ObraEntity } from 'src/obra/entities/obra.entity';
import { firstValueFrom } from 'rxjs';
import { GoogleDocService } from 'src/managerdrive/services/googleDocService';
//import { ITitulo_subtitulo } from 'src/toolbox/forValorizacion/generaSeparadores';
import { Footer, Header, ImageRun } from "docx";
import {
    BorderStyle,
    HeadingLevel,
    Table,
    TableBorders,
    TableCell,
    TableRow,
    TextDirection,
    VerticalAlign,
    
} from "docx";
import { agregaCabeceraTabla, agregarCeldas, generateTableFromPartidas, transformaPartidasToTable } from 'src/toolbox/forTablas/agregaCabeceraTabla';


@Injectable()
export class ValorizacionService {
    googleFileId:string
    googleFileId2:string
    constructor(
        @Inject(IVALORIZACION_REPOSITORY) private ivalorizacionRepository:IValorizacionRepository,
        @Inject(IOBRA_REPOSITORY) private iobraRepository:IObraRepository, 
        private jwtService: JwtService,
        private http:HttpService,
        private readonly googleDriveService: GoogleDriveService,
        protected readonly googleDocService:GoogleDocService,
        private readonly httpService : HttpService

    ){}

    async creaperiodovalorizacion(creaValorizacionDto: CreateValorizacionDto): Promise<ValorizacionEntity> {
        return await  this.ivalorizacionRepository.creaperiodovalorizacion(creaValorizacionDto)
    }

    async buscaById(obraId:string ): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.buscaById({obraId})
    }

    async buscaValoByObraId(obraId:string ): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.buscaValorizacionByObraId({obraId})
    }

    async actualizaValorizacion(obraId:string, actualizaObraDto:ActualizaValorizacionDto): Promise<ValorizacionEntity> {
        return await this.ivalorizacionRepository.actualizaValorizacion({obraId},actualizaObraDto)
    }

    async actualizaValorizacionFolderId(actualizaValorizacionFolderIdDTO: ActualizaValorizacionFolderIdDTO){
        
        return await this.ivalorizacionRepository.actualizaValorizacionFolderId(actualizaValorizacionFolderIdDTO)
    }

    async listaValorizaciones(){
        return await this.ivalorizacionRepository.listaValorizaciones({})
    }
    async subeImagenADrive(file:Express.Multer.File,idForGoogleElement: string){
        return await this.googleDriveService.subirImagen(file,idForGoogleElement)
    }
    async creaCarpetaDrive(carpetaContenedora:string,nombrecarpeta:string){
        return await this.googleDriveService.crearCarpeta(carpetaContenedora,nombrecarpeta)
    }

    async agregaevidenciafotografica(evidenciaFotografica:AgregaevidenciafotograficaDto):Promise<AgregaevidenciafotograficaDto>{
        
        const macho:any = await this.ivalorizacionRepository.agregaevidenciafotografica(evidenciaFotografica) 
        
        return macho
    }
    async showPicture(fileId:string){
        const fileid= "1llt9PCpU6Wlm97Y9GyIS1QpxOPPBuRtg"
        return await this.googleDriveService.obtenerwebViewLink(fileid)
    }
    async buscaObraById(obraId:string){
        const  entityFilterQuery: FilterQuery<ObraEntity> = {
            obraId
            
        }

        return await this.iobraRepository.buscaObraByObraId(entityFilterQuery)
    }

    async validateToken(token:string):Promise<string>{
        console.log(token)
        const verify = this.jwtService.verify(token.split(" ",2)[1],jwtConstants)
        return await verify.id
    }
    
    async dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId,mesSeleccionado)
    }
    async buscaMesSeleccionadoFolderIdPorMesSeleccionado(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.buscaMesSeleccionadoFolderIdPorMesSeleccionado(obraId,mesSeleccionado)
    }
    async actualizaEvidenciaFotografica(evidenciaFotografica:AgregaevidenciafotograficaDto){
        return await this.ivalorizacionRepository.actualizaEvidenciaFotografica(evidenciaFotografica)
    }
    //llamadas a pandas
    /*async calculoVertical(){
        return this.http.post('http://127.0.0.1:8000/hola/valores', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );
    }*/
    async  llamaAPandas() {
        const data = {
            'ID': [1, 2, 3, 4, 5],
            'Name': ['Car A', 'Car B', 'Car C', 'Car D', 'Car E'],
            'Price': [25000, 30000, 35000, 40000, 45000]}

        return this.http.post('http://127.0.0.1:8000/hola/valores', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );

        
    }

    async  valorizacion(data:any) {
        
        return this.http.post('http://127.0.0.1:8000/hola/valorizacion', data).pipe(//cambiar la url por la que está en el servidor IIS
            map((resp) => resp.data),
            tap((data) =>  console.log({"data":data})),
        );
    
    }
    async listaFotosSegunObraMesSeleccionado(obraId:string,mesSeleccionado:string){
        return await this.ivalorizacionRepository.listaFotosSegunObraMesSeleccionado(obraId,mesSeleccionado) 

    }
    public returnresponsetypeservice(){
        return  this.httpService.get('http://localhost:3000/valorizacion/creadocumentopanelfotografico',{responseType:'arraybuffer'})

    }
    public async cabecera(){
        /*const obra = await this.iobraRepository.buscaObraByObraId({obraId:'65d91ea6cc44ee97bd625b0d'})
        const logoId = obra.logoUrl.split('&id=',2)[1]
        const cabeceraImagen = await this.googleDriveService.descargaImagenArrayBuffer(logoId)
        //console.log({"logoId":logoId,"cabeceraimagen":cabeceraImagen.data})
        const doc  = cabecera_piepagina(cabeceraImagen.data)
        
        Packer.toBuffer(doc).then((buffer) => {

            firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=12M9t7l4j6nRz47UFHZfJrkIMK-7rdcYI`,{responseType:'arraybuffer'}))//copia la plantilla
                .then(async (arrayBuffer:any)=>{
                  
                                this.googleFileId = await  this.googleDocService.creaDocumento(buffer,"informe residente","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
                  

        
                  return this.googleFileId
          
                })
              
          })*/
    }

    public async informeresidente(googleFileId:string){

        //utilizar patcher desde DOCX, para poder cambiar los demás textos faltantes.
        //utilizar colores, formatos dinamicos
        //colores en el contenido de las tablas
        //abrir el archivo
        const obra = await this.iobraRepository.buscaObraByObraId({obraId:'65d91ea6cc44ee97bd625b0d'})
        const logoId = obra.logoUrl.split('&id=',2)[1]
        const cabeceraImagen = await this.googleDriveService.descargaImagenArrayBuffer(logoId)
        
       
        firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=12M9t7l4j6nRz47UFHZfJrkIMK-7rdcYI`,{ responseType:'arraybuffer'}))//copia la plantilla
                .then(async (arrayBuffer1:any)=>{
                    
                    //inicio del reemplazo de my_patch
                    patchDocument(arrayBuffer1.data, {
                        patches: {
                            my_patch: {
                                type: PatchType.PARAGRAPH,
                                children: [new TextRun("Sir. "), new TextRun("John Doe"), new TextRun("(The Conqueror)")],
                            },
                            my_second_patch: {
                                type: PatchType.DOCUMENT,
                                children: [
                                    new Paragraph("Lorem ipsum paragraph"),
                                    new Paragraph("Another paragraph"),
                                    
                                ],
                            },
                        },
                    }).then(async(patch)=>{
                        
                        this.googleFileId = await this.googleDocService.creaDocumento(patch,"informe residente","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
 
                    })
                    //fin del reemplazo de my_patch y my_second_patch

                    //inicio imagen del encabezado
                    .then(()=>{
                        firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=${this.googleFileId}`,{ responseType:'arraybuffer'}))
                        .then(async(arrayBuffer2:any)=>{
                            const twip = convertMillimetersToTwip(149.8); // returns 8492
                            const celda = 18.7
                            const widthColumnItem= convertMillimetersToTwip(celda)//una celda en excel
                            const widthColumnDescripcion= convertMillimetersToTwip(celda*4)
                            const widthColumnUnd= convertMillimetersToTwip(celda+2.3)
                            const widthColumnCantidad= convertMillimetersToTwip(celda+2.3)
                            
                            patchDocument(arrayBuffer2.data, {
                                patches: {
                                    encabezado: {
                                        type: PatchType.DOCUMENT,//necesario para usa la alineacion
                                        children: [
                                            new Paragraph({//necesario para agregarle el alineamiento central
                                                children: [
                                                    new ImageRun({
                                                        data: cabeceraImagen.data,
                                                        transformation: {
                                                            width: 100,
                                                            height: 100,
                                                        },
                                                        
                                                    }),   
                                                ],
                                                
                                                alignment: AlignmentType.CENTER
                                            })],
                                    },
                                    //tabla
                                    table: {
                                        type: PatchType.DOCUMENT,
                                        children: [
                                            new Table({
                                                columnWidths: [widthColumnItem, widthColumnDescripcion,widthColumnUnd, widthColumnCantidad],
                                                rows: generateTableFromPartidas(partidas)
                                                /*[
                                                    new TableRow({
                                                        tableHeader: true,
                                                        children: filas()
                                                        [
                                                            new TableCell({
                                                                children: [new Paragraph({children:[new TextRun({text:"ohla color",color:"00FFFF"})] }) ],
                                                                verticalAlign: VerticalAlign.CENTER,
                                                                
                                                            }),
                                                            new TableCell({
                                                                children: [new Paragraph({children:[new TextRun({text:"ohla color",color:"00FFFF"})] })],
                                                                verticalAlign: VerticalAlign.CENTER,
                                                                
                                                            }),
                                                            new TableCell({
                                                                children: [new Paragraph({children:[new TextRun({text:"ohla color",color:"00FFFF"})] })],
                                                                //textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                                                            }),
                                                            new TableCell({
                                                                
                                                                children: [new Paragraph({children:[new TextRun({text:"ohla color",color:"00FFFF"})] })],
                                                                //textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
                                                            }),
                                                            
                                                              
                                                              
                                                            
                                                        ],
                                                    }),
                                                    new TableRow({
                                                        children: [
                                                            new TableCell({
                                                                children: [
                                                                    new Paragraph({
                                                                        text: "Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah",
                                                                        //heading: HeadingLevel.HEADING_1,
                                                                    }),
                                                                ],
                                                                
                                                            },
                                                            
                                                            ),
                                                            new TableCell({
                                                                children: [
                                                                    new Paragraph({
                                                                        text: "This text should be in the middle of the cell",
                                                                    }),
                                                                ],
                                                                verticalAlign: VerticalAlign.CENTER,
                                                            }),
                                                            new TableCell({
                                                                children: [
                                                                    new Paragraph({
                                                                        text: "Text above should be vertical from bottom to top",
                                                                    }),
                                                                ],
                                                                verticalAlign: VerticalAlign.CENTER,
                                                            }),
                                                            new TableCell({
                                                                children: [
                                                                    new Paragraph({
                                                                        text: "Text above should be vertical from top to bottom",
                                                                    }),
                                                                ],
                                                                verticalAlign: VerticalAlign.CENTER,
                                                            }),
                                                        ],
                                                    }),
                                                ],*/
                                            }),]}
                                },
                            }).then(async(patch)=>{
                                this.googleFileId2 = await this.googleDocService.creaDocumento(patch,"informe residente","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
                                this.googleDocService.eliminaDocumentoCarpeta(this.googleFileId)
                            })
                             //fin de imagen del encabezado
                              //inicio del reemplazo utilizando docx-template
                              //+++myvariable+++
                            .then(()=>{
                                firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=${this.googleFileId2}`,{ responseType:'arraybuffer'}))
                                .then(async(arrayBuffer2:any)=>{
                            
                                    let template = Buffer.from(arrayBuffer2.data,'binary')
                                    const buffer1 = await createReport({//reemplaza los valores segun plantilla
                                    template,
                
                                    data:{
                                        myvariable:"hola desde docx-template",
                                    }
                                });
                    
                                this.googleDocService.creaDocumento(buffer1,"informe residente total","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
            
                                })
                                //fin del reemplazo +++myvariable+++
                                //inicio insercion de tabla con colores
                                .then(()=>{

                                })
                                //fin insercion de tabla con colores
                            
                            })
                        })
                        
                    })
                   

                  
                    
                    
                })
                
         /*.then((doc)=>{
                        Packer.toBuffer(doc).then((buffer) => {

                            firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=12M9t7l4j6nRz47UFHZfJrkIMK-7rdcYI`,{responseType:'arraybuffer'}))//copia la plantilla
                                .then(async (arrayBuffer:any)=>{
                                  
                                                this.googleFileId = await  this.googleDocService.creaDocumento(buffer,"informe residente","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
                                  
                
                        
                                  
                          
                                })
                              
                          })

                    })*/
               

        
        

        
        
       /* let items:Array<object> =[]
        partidas.map((partida,index)=>{
            items.push(coloreaPartida(partida.item,index)) 
        })
        
        
        


      firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=12M9t7l4j6nRz47UFHZfJrkIMK-7rdcYI`,{responseType:'arraybuffer'}))//copia la plantilla
          .then(async (arrayBuffer)=>{
                    
            let template = Buffer.from(arrayBuffer.data,'binary')
            const cabecera = await this.cabecera()
    
            const buffer1 = await createReport({//reemplaza los valores segun plantilla
              template,

              data:{
                cabecera:{//los cuatro elementos sirven para representar la foto
                    data:cabecera,
                    extension:".jpeg",
                    height:3,
                    width:5
                },
                project:{
                    
                    partidas:[
                        {
                            item:'03',
                            descripcion:'SISTEMA DE AGUA POTABLE',
                            und:"",
                            cantidad:""
                        },
                        {
                            item:'03.01',
                            descripcion:'CAPTACION',
                            und:"",
                            cantidad:""
                        },
                        {
                            item:'03.01.01',
                            descripcion:'CAPTACION TIPO C-1 (1 UND) + CERCO PERIMETRICO',
                            und:"UND",
                            cantidad:"1"
                        },
                        {
                            item:'03.01.02',
                            descripcion:'CAPTACION TIPO C-2 (1 UND) + CAMARA HUMEDA + CAMARA SECA + CERCO PERIMETRICO',
                            und:"UND",
                            cantidad:"1"
                        },
                        {
                            item:'03.02',
                            descripcion:'LINEA DE CONDUCCION (L=288.62 M)',
                            und:"M",
                            cantidad:"2882.61"
                        },
                        {
                            item:'04',
                            descripcion:'SISTEMA DE AGUA DESAGUE',
                            und:"",
                            cantidad:""
                        }
                    ]
                }
            }
            });
    
            this.googleDocService.creaDocumento(buffer1,"informe residente","1VDf6sK9Whc3SMwRgPMP9jl8KQ1b5lf7t")//crea un nuevo archivo en google, con la plantilla reemplazada
    
          })*/
        
    

  }
    public async plantillaDocxV3(){
        const evidencias:any[] = []
        let payload:any
        let carpetaContenedoraId:string
        let evidenciasFotograficasId:any[]=[]
        try {
          
            payload = await this.buscaMesSeleccionadoFolderIdPorMesSeleccionado('65d91ea6cc44ee97bd625b0d','Diciembre')
            carpetaContenedoraId = payload.periodos[0].mesSeleccionadoFolderId;
            evidenciasFotograficasId = payload.periodos[0].panelFotografico.map((evidenciaFotografica:any,index:number)=>
                    {
                        return evidenciaFotografica.urlFoto.split('&id=',2)[1];
                    })
         

            const funcs = evidenciasFotograficasId.map(url => () => this.googleDriveService.descargaImagenArrayBuffer(url))
            /*
            * serial executes Promises sequentially.
            * @param {funcs} An array of funcs that return promises.
            * @example
            * const urls = ['/url1', '/url2', '/url3']
            * serial(urls.map(url => () => $.ajax(url)))
            *     .then(console.log.bind(console))
            */
            const serial = funcs =>
            funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
            //fin de la funcion

            serial(funcs)
            .then(async(val:any[])=>{
                
                val.map((myval,index)=>{
                    evidencias.push({
                        nro: `Fotografía N° ${index + 1}`,
                        partida:"imagename.partida",
                        descripcion:"imagename.descripcion",
                        foto:{//los cuatro elementos sirven para representar la foto
                            data:myval.data,
                            extension:".jpeg",
                            height:9,
                            width:11
                        },
                    })
                })
                const objetivos = [
                    {nombre:"uno"},{nombre:"dos"}, {nombre:"tres"},{nombre:"cuatro"}]
            //
           firstValueFrom(this.httpService.get(`https://drive.google.com/uc?export=download&id=13ac0DZICU_2pXnFt-hLl0d6ruRwmYNeY`,{responseType:'arraybuffer'}))//copia la plantilla
          .then(async (arrayBuffer)=>{
            
            let template = Buffer.from(arrayBuffer.data,'binary')
            console.log(evidencias)
            const buffer1 = await createReport({//reemplaza los valores segun plantilla
              template,
              data: {evidencias}
            });
    
            this.googleDocService.creaDocumento(buffer1,"panel fotografico",carpetaContenedoraId)//crea un nuevo archivo en google, con la plantilla reemplazada
    
          })


        })
           
        } catch (error) {
          
        }
    
      }
      
  

}

export const contenido = {
    
        
        periodo:"03",
        mesSeleccionado:"Marzo",
        anio:"2024",
        nombre_obra:"Mejoramiento",
        fecha_viabilizacion:'30 de enero del 2024',
        cui:'123321',
        problematica:"falta de agua y desague",
        
        //ubigeo
        region:"Ancash",
        departamento:"Anash",
        provincia:"Ancash",
        distrito:'my distrito',
        localidad:"my localidad",

        poblacion:"150",
        familias:"50",

        financiador:'la region dew ancash',
        fecha_buena_pro:'30 de diciembre del 2024',
        proceso_seleccion:'Adjudicación Simplificada N°020-2023-MDC/CS',
        fecha_contrato:'30 de enero 2024',
        representante:
        {
            nombre:'my representante legal',
            legal:'',
            comun:"comun",
            empresa:"",
            consorcio:"consorcio HATUN HUASY"
        },
        consorcio:false,
        empresa:false,
        monto_obra:12364,
        comun:false,
        en_numeros:'ciento con 00/100',
        plazo_ejecucion:'30',
        nombres_apellidos_residente:"my recidente",
        cip_residente:'my cip residente',
        nombres_apellidos_seguridad:"my seguridad",
        cip_seguridad:"my cip seguridad",
        nombres_apellidos_especialista1:"my especialista1",
        cip_especialista1:"my cip especialista1",
        nombres_apellidos_especialista2:"my especialista2",
        cip_especialista2:"my cip especialista2",
        empresa_supervision:{
            nombre:"my empresa superisora",//ponder true o false,
            activo:true,
            supervisor:"my supervisor de la obra"
        },
        supervisor:"my super",
        supervisor_cip:"my cip del super",
        objetivos_especificos:[
            'objetivo 1',
            'objetivo 2'
        ],
        metas_fisicas:[
            {
                metas:[
                    {
                        titulo:'primera meta',
                        detalles:[
                            'detalle primera meta 1',
                            'detalle primera meta 2',
                            'detalle primera meta 3'
                        ]
                    },
                    {
                        titulo:'segunda meta',
                        detalles:[
                            'detalle segunda meta 1',
                            'detalle segunda meta 2',
                            'detalle segunda meta 3'
                        ]

                    }
                ],
            },
            

        ]

}
export const partidas = 
    [
        {
            item:'03',
            descripcion:'SISTEMA DE AGUA POTABLE',
            und:"",
            cantidad:""
        },
        {
            item:'03.01',
            descripcion:'CAPTACION',
            und:"",
            cantidad:""
        },
        {
            item:'03.01.01',
            descripcion:'CAPTACION TIPO C-1 (1 UND) + CERCO PERIMETRICO',
            und:"UND",
            cantidad:"1"
        },
        {
            item:'03.01.02',
            descripcion:'CAPTACION TIPO C-2 (1 UND) + CAMARA HUMEDA + CAMARA SECA + CERCO PERIMETRICO',
            und:"UND",
            cantidad:"1"
        },
        {
            item:'03.02',
            descripcion:'LINEA DE CONDUCCION (L=288.62 M)',
            und:"M",
            cantidad:"2882.61"
        },
        {
            item:'04',
            descripcion:'SISTEMA DE AGUA DESAGUE',
            und:"",
            cantidad:""
        }
    ]



 
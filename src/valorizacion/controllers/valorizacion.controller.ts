import { BadRequestException, Body, Controller, Get, Headers, Param, Patch, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { AgregaevidenciafotograficaDto, CreateValorizacionDto, EvidenciaFotograficaDTO } from '../dtos/crud.valorizacion.dto';
import { EvidenciaFotografica, Valorizacion } from '../entities/valorizacion.entity';
import { ValorizacionService } from '../services/valorizacion.servicio';
import * as fs from 'fs'
import  * as path from 'path';
import { LoggingInterceptor } from 'src/auth/services/interceptortoken.service';
import { jwtConstants } from 'src/constants/constants';
import { JwtService } from '@nestjs/jwt';
import { JwtstrategyService } from 'src/auth/services/jwtstrategy.service';
import { TokenInterceptor } from '../services/intersepta_Token';
import { PictureInterceptor } from '../services/pictureInterceptor';
import { generateRouterForValorizacion } from 'src/toolbox/forValorizacion/generaSeparadores';
import { Console } from 'console';
//import { generaIndice } from 'src/toolbox/generaIndicePDF';
//import { generateFoldersInFolderProjects, ISeparador } from 'src/toolbox/generaCarpetas';
//import { compressIntereFolder } from 'src/toolbox/forValorizacion/comprimeCarpeta';

// npm install googleapis@105 @google-cloud/local-auth@2.1.0 --save


const fsp = fs.promises;



const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// File id of the file to download
const FILEID = '17xTZ2zs0O49pTf8K4sNikXUvWeknK2wt';


// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join('d:\\client_secret.json');
const CREDENTIALS_PATH = 'd:\\client_secret.json';//client_secret sadsinfactura


@Controller('valorizacion')
export class ValorizacionController {
    constructor(
        private valorizacion:ValorizacionService,
        private jwtService: JwtService,
    ){

    }
    public au:string
    public pathToImage:string
    
    @Get('lista')
    async listaValorizaciones():Promise<Valorizacion[]>
    {
        
        return this.valorizacion.listaValorizaciones()
    }

    @Get('buscaPorId')
    async buscaPorId(obraId:string):Promise<Valorizacion>{
        return  this.valorizacion.buscaById(obraId)
    }
    
    @Get('listaValorizacionByobraid/:obraId')
    async buscaValoPorObraId(
        @Param('obraId') obraId:string
        ):Promise<Valorizacion >{

        return this.valorizacion.buscaValoByObraId(obraId)
    }

    @Post('creaperiodovalorizacion')
    async createValorizacion(@Body() valorizacion:any){ 
        
        return  this.valorizacion.creaperiodovalorizacion(valorizacion)
    }
    
    @UseInterceptors(
        LoggingInterceptor,
        FileInterceptor('file', {
          storage: diskStorage({
            async destination(req, file, callback) {
                const filePath = (`./uploads/${req.body.usuarioId}/${req.body.obraId}/${req.body.mesSeleccionado}/fotos`)// por motivos que pictures:filename es afectado, se cambiará la ruta
                //const filePath = (`./uploads/todaslasfotos`)
                //se necesita crear la carpeta a mano
                await fs.promises.mkdir(`${filePath}`,{recursive:true})
                //callback(null,`./uploads`)
                callback(null,`${filePath}`)
            },//: ,//`${_}./uploads`,
            filename: ( req, file, cb)=>{
                const name = file.mimetype.split("/");
                const fileExtention =   name[name.length - 1];
                const newFileName = name[0].split(" ").join("_")+Date.now()+fileExtention;
              cb(null, newFileName)
            },
          }),
         fileFilter: (req,file,cb)=>{
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(null,false)
            }
            cb(null,true)
         },
        }),
      )
    @Post('agregaevidenciafotografica')
    async evidenciafotografica(
        @UploadedFile() file:Express.Multer.File,
        @Body() agregaEvidenciaFotografica:any,
        @Headers('authorization') autorization:string)//interceptada por medio de LoggingInterceptor la cabecera que trae el token
        {//: Promise<CreateCatDto>
            console.log({"autorization de evidencia fotografica":autorization})//envia desde el post
            const usuarioId = agregaEvidenciaFotografica.usuarioId
            const obraId = agregaEvidenciaFotografica.obraId
            const messeleccionado =agregaEvidenciaFotografica.mesSeleccionado
            


           // const filePath = `./uploads/${agregaEvidenciaFotografica.usuarioId}/${agregaEvidenciaFotografica.obraId}/${agregaEvidenciaFotografica.mesSeleccionado}`
            //this.pathToImage = filePath
            
            if(!file){
            throw new BadRequestException("file is not a imagen")
            }
        
        const response = {
           filePath:`https://192.168.1.86:3033/valorizacion/pictures/${usuarioId}/${obraId}/${messeleccionado}/fotos/${file.filename}`
            
        };
        
       agregaEvidenciaFotografica.urlFoto = response.filePath
        
        const body:AgregaevidenciafotograficaDto = {
            descripcionTrabajos:agregaEvidenciaFotografica.descripcion ,
            mesSeleccionado:agregaEvidenciaFotografica.mesSeleccionado,
            obraId:agregaEvidenciaFotografica.obraId,
            partida:agregaEvidenciaFotografica.partida,
            urlFoto:response.filePath

            
        }
       
        const macho:any = await this.valorizacion.agregaevidenciafotografica(body) 
       
        return macho
        
       
    }
    //necesario para mostrar la imagen en el clinte 
     // llama automaticamente cuando se hace la referencia [src] =192.168.1.86:30333 . . .. 
    //
    
    @Get('pictures/:usuarioid/:obraid/:messeleccionado/fotos/:filename')
    async getPicture(
        @Param('usuarioid') usuarioid:any,
        @Param('obraid') obraid:any,
        @Param('filename') filename:any, 
        @Param('messeleccionado') messeleccionado:any, 
        @Res() res:Response,
        
    ){
    //necesitas cargar desde aca lo necesario para que path file name no dependa  de agrgarevidenciafotografica
    
     const filePath = `./uploads/${usuarioid}/${obraid}/${messeleccionado}/fotos`
            
        res.sendFile(filename,{root:`${filePath}`})
    }
    /**
     * actualiza evidencia fotografica
     */
     @UseInterceptors(
        LoggingInterceptor,
        FileInterceptor('file', {
          storage: diskStorage({
            async destination(req, file, callback) {
                const filePath = (`./uploads/${req.body.usuarioId}/${req.body.obraId}/${req.body.mesSeleccionado}`)
                //se necesita crear la carpeta a mano
                await fs.promises.mkdir(`${filePath}`,{recursive:true})
                //callback(null,`./uploads`)
                callback(null,`${filePath}`)
            },//: ,//`${_}./uploads`,
            filename: ( req, file, cb)=>{
                const name = file.mimetype.split("/");
                const fileExtention =   name[name.length - 1];
                const newFileName = name[0].split(" ").join("_")+Date.now()+"."+fileExtention;
              cb(null, newFileName)
            },
          }),
         fileFilter: (req,file,cb)=>{
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(null,false)
            }
            cb(null,true)
         },
        }),
      )
    @Patch('actualizaevidenciafotografica/:obraId/:mesSeleccionado')
    actualizaEvidenciaFotografica(
        @UploadedFile() file:Express.Multer.File,
        @Param('obraId') obraId:string,
        @Param('obraId') mesSeleccionado:string,
        @Body() cuerpo:any,
        @Headers('authorization') autorization:string//interceptada por medio de LoggingInterceptor la cabecera que trae el token
        
    ){

        const filePath = `./uploads/${cuerpo.usuarioId}/${cuerpo.obraId}/${cuerpo.mesSeleccionado}`
        this.pathToImage = filePath
            
        if(!file){
            throw new BadRequestException("file is not a imagen")
        }
        
        const response = {
           filePath:`https://192.168.1.86:3033/valorizacion/pictures/${file.filename}`
            
        };
        cuerpo.urlFoto = response.filePath
        console.log({"es el cxuerop cuerpo":cuerpo})
        
        const body:AgregaevidenciafotograficaDto = {
            descripcionTrabajos:cuerpo.descripcion ,
            mesSeleccionado:cuerpo.mesSeleccionado,
            obraId:cuerpo.obraId,
            partida:cuerpo.partida,
            urlFoto:response.filePath
        }
        return this.valorizacion.actualizaEvidenciaFotografica(body)

    }
    /*@UseInterceptors(LoggingInterceptor)
    @Post('comprimecarpeta')
    async comprimeCarpeta(@Req() req:Request,@Headers('authorization') autorization:string){

       console.log({"dentro de comprime carpeta":req.body})
        const indices:any[] = req.body.data
        
        const obraId:string = req.body.idproyecto 
        const usuarioId:string | { [key: string]: any; } = this.jwtService.decode(autorization)  
        
        const config = {
            idproyecto:obraId["code"],
            idusuario:usuarioId["id"]
        }

       
       await  compressIntereFolder.main(config.idusuario,config.idproyecto)//crea los separadores dentro de usuarioid/proyectoid/valorizacion
       return "comprimido"
       
    }*/


    /*@Post('generaseparadoresconindice')
    async createFoldersInWindows(@Req() req:Request){

        const indices:any[] = req.body.data
        
        generaIndice(indices)
        
        const usuarioId:string | { [key: string]: any; } = this.jwtService.decode(req.body.token) 
        const config:ISeparador = {
            rutasGeneradas:generateRouterForValorizacion(indices),
            idproyecto:req.body.idObra["code"],
            idusuario:usuarioId["id"],
            nroValorizacion:2,
            mesSeleccionado:req.body.mesValorizacion
        }

       const path = `${config.idusuario}/${config.idproyecto}`
       return generateFoldersInFolderProjects(config,path)//crea los separadores dentro de usuarioid/proyectoid
       
    }*/
    @Get('curvas')
    curvas(){
        return this.valorizacion.llamaAPandas()
    }

    /**
     * 
     * @param obraId 
     * @param mesSeleccionado 
     * @returns 
     */
    //consultas
    @Get('consultas/:obraId/:mesSeleccionado')
    dadoUnMesSeleccionadoMostarSuPanelFotografico(
        @Param('obraId') obraId:string,
        @Param('mesSeleccionado') mesSeleccionado:string

    ){
        console.log({obraId,mesSeleccionado})
        
        return this.valorizacion.dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId,mesSeleccionado)

    }
    @Post('valo')
    valo(){
        const configuracion = {
            gg:20,//20% de cd
            utilidad:10, //10% del cd
            igv:18,//18% del sub total
            nroValorizacion:1,
            imagenUrl:'https://192.168.1.86:3033/valorizacion/pictures/6573218330b6dc0e1d23ba90/65a9b71ffdd42b7873b4bc9e/Diciembre/fotos/image1705621307593.png'
        }
       
        const presupuestoContractual = [
            ["1","a","m",1,2190.46,2190.46],
            ["2","a","m",1,1764,1764],
            ["3","a","m",1.5,500,750],
            ["4","a","m",1,2000.64,2000.64],
            ["5","a","m",1,3083.92,3083.92],
            ["6","a","m",0.90,1.12,1.01],
            ["7","a","m",0.90,2.20,1.98],
            
        ]
        let avancefisicomensualActual = [
            
            ["","","","","",""],
            ["","","","","",0.52],
            ["","","","","",0.77],
            ["","","","","",0.75],
            ["","","","","",0.75],
            ["","","","","",""],
            ["","","","","",""],

            
        ]
        let avanceFisicoMensualAnterior = [
            ["","","","","",1],
            ["","","","","",0.48],
            ["","","","","",0.73],
            ["","","","","",0.25],
            ["","","","","",0.25],
            ["","","","","",0.90],
            ["","","","","",0.90],
            
            
        ]
        let metradoAcumuladoMensualAnterior:Array<any[]>=[]
        
        if(configuracion.nroValorizacion != 0){
            metradoAcumuladoMensualAnterior = metradoMensualAcumulado(avanceFisicoMensualAnterior)
        }
        else{
            presupuestoContractual.forEach((presupuesto)=>{
                metradoAcumuladoMensualAnterior = metradoAcumuladoMensualAnterior.concat([0])

            })
            
        }
        
        let idpartida:string[] = []
        let descripcion:string[] = []
        let u_medida:string[]=[]
        let metrado:number[]=[]
        let precio_unitario:number[]=[]
        let parcial:number[]=[]
        
        //poniendo las cabeceras
        presupuestoContractual.forEach((presup:any[],index)=>{
            idpartida = idpartida.concat(presup[0])
            descripcion = descripcion.concat(presup[1])
            u_medida = u_medida.concat(presup[2])
            metrado = metrado.concat(presup[3])
            precio_unitario = precio_unitario.concat(presup[4])
            parcial = parcial.concat(presup[5])
           
        })

        const data ={
            valorizacion: {
                idpartida,
                descripcion,
                u_medida,
                metrado,
                precio_unitario,
                parcial,
                metradoAnterior:metradoAcumuladoMensualAnterior,
               
                metradoActual : metradoMensualAcumulado(avancefisicomensualActual),
                

            },    
            configuracion
        }
        console.log(data)
        return this.valorizacion.valorizacion(data)
    }
    @Get('descarga')
    descarga(@Res() response: Response){
       // response.download('https://drive.google.com/file/d/17xTZ2zs0O49pTf8K4sNikXUvWeknK2wt')
       this.authorize().then(this.downloadFile).catch(console.error)

    }
    /**
    * Reads previously authorized credentials from the save file.
    *
    * @return {Promise<OAuth2Client|null>}
    */
    async loadSavedCredentialsIfExist() {
    try {
        const content:any = await fsp.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
            } catch (err) {
                return null;
        }
    }
    /**
    * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
    *
    *@param {OAuth2Client} client
    *@return {Promise<void>}
    */
    async saveCredentials(client) {
        const content:any = await fsp.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
    await fsp.writeFile(TOKEN_PATH, payload);
    }
    /**
    * Load or request or authorization to call APIs.
    *
    */
    async authorize() {
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }
    /**
    * Download file
    * @param {OAuth2Client} authClient An authorized OAuth2 client.
    */
    async downloadFile(authClient) {

        const service = google.drive({version: 'v3', auth: authClient});
    
        const fileId = FILEID;
        try {
    
            // get the file name
            const fileMetaData = await service.files.get({
                    fileId: fileId, fields: 'name'
                },
            );
    
            // create stream writer with the file name from drive
            const fileStream = fs.createWriteStream(fileMetaData.data.name)
            console.log('downloading: ' + fileMetaData.data.name);
    
            const file = await service.files.get({
                fileId: fileId,
                alt: 'media',
            }, {
                    responseType: "stream"
                }
            );
    
            file.data.on('end', () => console.log('onCompleted'))
            file.data.pipe(fileStream);
    
        } catch (err) {
            // TODO(developer) - Handle error
            throw err;
        }
    }

}
function metradoMensualAcumulado(metradoDiario:Array<any[]>):any[]{
    let tmp2:number[] = []
    let tmp3:number = 0
    let metradoAcumulado:any[] = []
    metradoDiario.forEach((avance:any[])=>{
    //suma de todo el avance fisico
    tmp2 = avance.filter((dia:any)=>{//retorna un array con el filtro aplicado[]
         return (dia != "")
    })
    //console.log(tmp)
    tmp2.forEach((diario:number)=>{
        //console.log({"diario":diario})
        tmp3 = tmp3 + diario
    })
    metradoAcumulado.push(tmp3)
    tmp3 = 0
    })
    return metradoAcumulado
}
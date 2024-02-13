/*import * as fs from 'fs'
import  * as path from 'path';
import * as PDFDocument from 'pdfkit';


export interface ITitulo_subtitulo{
  titulo:string;
  columna:number
}

export interface ISeparador{
  rutasGeneradas:string[];
  idusuario:string | { [key: string]: any; };
  idproyecto:number;
  nroValorizacion:number;
  mesSeleccionado:string
}
//para la creacion de los separadores del indice, se tiene que tener en consideracion los siguientes parametros
//- idusuario
//- idproyecto


export async function generateFoldersInFolderProjects(carpeta:any,rutaEscritura:string ="default"){

    //console.log(carpeta.mysRutasCortas)
    const filePath = path.join(`./uploads/${rutaEscritura}`)

   
    carpeta.rutasGeneradas.mysRutasCortas.map(async (val,index)=>{ // es un valor: /a1   ; /a1/a1.1

    const doc = new PDFDocument({
      size: "A4"//typePage
    });
    
    let tmp = val.split("/") //["","a1"]
    
    
    let indice:Array<string> = tmp.filter((elemento:any)=>{
      return elemento !=''
    })//["a1"] ["a1","a1.1"]
    
    
    //las carpetas asi como sus jerarquias se crean con el val. puesto que tiene la creacion tal cual el indice
    await fs.promises.mkdir(`${filePath}/SEPARADOR/${val}`,{recursive:true});
    doc.image(`${path.join(process.cwd(),'\\src\\assets\\plantilla.png') }`,0,0,{width:500,height:842});  
    doc.font(`${path.join(process.cwd(),'\\src\\assets\\AmaticSC_Regular.ttf')}`).fontSize(20)
    
   // documento.fontSize(12).text(`${newString[newString.length - 1]}`,{indent:72*index})
    let algo = carpeta.rutasGeneradas.mysRutas[index].split("/")
    let otroAlgo = algo.filter((el)=>{
      return el !=="" 
    })
    
    
    doc.pipe(fs.createWriteStream(`${filePath}/SEPARADOR/${val}/${indice[indice.length - 1].substring(0,18)}.pdf`));
    doc.fontSize(60).text(`${otroAlgo[otroAlgo.length - 1]}`,150,265,{align:"center"}) 
    
    doc.end()
   })
   



        
}

*/

//se tiene que pasar a google drive
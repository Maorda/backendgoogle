/*import  * as path from 'path';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs'

interface INombreColumna{
    titulo:string;
    columna:number
  }*/
/**
 * @param indices son los indices obtenidos del archivo exel
 * @description Genera el índice en pdf y lo almacena en rutaEscritura 
 * 
 */
/*export function generaIndice(indices:INombreColumna[],rutaEscritura:string="default"){
        
    const filePath = path.join(`./uploads/${rutaEscritura}`)
    
    const indice = new PDFDocument({
        size: "A4"//typePage
    });
    
    indice.image(`${path.join(process.cwd(),`\\src\\assets\\indice.png`)}`,-300,635,{width:850, height:250});
    indice.pipe(fs.createWriteStream(`${filePath}/INDICE.pdf`));   
    indice.text(`INDICE`,{width:400,align:'center'});
    
    indices.map((val:INombreColumna)=>{
        
        indice.moveDown()
        indice.text(`${val.titulo}`,{width:400,indent:Number(val.columna)*10});
    })
    indice.end()
    return {message:"indice pdf creado"}

}
*/

//se tiene que pasar a google drive
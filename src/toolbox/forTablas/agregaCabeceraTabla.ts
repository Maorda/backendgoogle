import {
    BorderStyle,
    HeadingLevel,
    Table,
    TableBorders,
    TableCell,
    TableRow,
    TextDirection,
    VerticalAlign,
    Paragraph, TextRun
    
} from "docx";

/**
 * 
 * @returns Retorna los nombres de la Cabecera de la tabla
 * @description Funcion que agrega la cabecera a la tabla 
 */
export function agregaCabeceraTabla (){
    return [
        {
            text:'ITEM',
            color:'aaaaaa',
            
        },
        {
            text:'DESCRIPCION',
            color:'aaaaaa',
            
        },
        {
            text:'U.MEDIDA',
            color:'aaaaaa',
            
        },
        {
            text:'CANTIDAD',
            color:'aaaaaa',
            
        },
    ]
   

}
/**
 * 
 * @param data es un array del formato {text:"algo",color:"ffffff"},
 * @returns retorna la celda con el formato que necesita TableCell
 */
export function agregarCeldas(data:any[]){
    const mysCeldas:any[]=[];
    data.map((elem)=>{
        mysCeldas.push(new TableCell({
            children: [new Paragraph({children:[new TextRun({text:elem.text,color:elem.color})] })],
        }))
    })
    return mysCeldas
}

/**
 * 
 * @param data son las partidas con el formato [{item:"01",descripcion:"puente",umedida:"m",cantidad:2}]
 * @returns retorna un array con el formato  [{text:'01',  color:'aaaaaa'},{text:"puente",color:"aaaaa"},{text:"m",color:"aaaaaa"},{text:"2",color:"aaaaaa"}]
 */

export function transformaPartidasToTable (data:any[]){
    let transform1:any[][] =[//maximo de 1000 partidas
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    ]; 
    let color:string
    for(let i=0;i<data.length;i++){
        color = coloreaPartida(Object.values(data[i])[0])
         for(let j=0;j<Object.values(data[i]).length;j++){ 
            transform1[i][j]=({text: Object.values(data[i])[j],color:color})
         } 
       }
    return transform1
}
/**
 * 
 * @param itemPartida es el item de la partida "01.01.01"
 * @returns retorna el color, segun el nivel del item que analiza
 */

export function coloreaPartida (itemPartida:any):any {
    console.log(itemPartida.split(".").length)
    
    if(itemPartida.split(".").length === 0){
        return "4dc964"
    }
    if(itemPartida.split(".").length === 1){
        return "ff2d55"
    }
    if(itemPartida.split(".").length === 2){
        return "34aadc"
        
    }
    if(itemPartida.split(".").length === 3){
        return "ffcc00"
    }
    if(itemPartida.split(".").length === 4){
        return "4dc964"
    }
}

/**
 * @description permite generar una tabla de partidas, con colores deficnidos por el nivel de item, el formato es para docx
 * @param partidas son las partidas con el formato de partida comvencional que son capturados del excel
 * @returns retorna la table en el formato de docx
 */
export function generateTableFromPartidas(partidas:IPartida[]){
    const myTableRow:any[] = [] 
    //partidas.unshift(agregaCabeceraTabla())
    const data:any[] =transformaPartidasToTable(partidas)
    data.unshift(agregaCabeceraTabla())

    for(let i =0;i<data.length;i++){
       
       myTableRow.push(new TableRow({
        children:agregarCeldas(data[i])
       }))
        
    }
    return myTableRow
}

interface IPartida {
    item:string;
    descripcion:string;
    und:string;
    cantidad:string;
}
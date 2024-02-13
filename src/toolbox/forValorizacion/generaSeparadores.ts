export interface ITitulo_subtitulo{
  titulo:string;
  columna:number;
}
export function generateRouterForValorizacion(datos:ITitulo_subtitulo[]):any{
  //iniciar por la parte final
  const mysRutas:any[]=[]
  const mysRutasCortas:any[]=[]
  let otraruta ="";
  let rutaCorta = ""
  let item = 0
  let puntero = 0;
  const objetos:any[]=[];
  const grupos:any[][] =[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

  grupos[item] = grupos[item].concat(datos[datos.length - 1])
  for(let i=1  ; i<= datos.length; i++){   
       puntero = datos.length - i //7
       //almacena objeto
       objetos.push(datos[puntero])
       
       if( objetos[objetos.length - 2] !== undefined ){//existe el anterior
           if(objetos[objetos.length - 2].columna === objetos[objetos.length - 1].columna){ //es hermano el objeto actual
               //agregamos al grupo, en la misma posicion
               grupos[item] = grupos[item].concat(objetos[objetos.length - 1])

           }else {
               if(objetos[objetos.length - 1].columna > objetos[objetos.length - 2].columna){//corta en este elemento
               //cada vez que coreta, el item se incrementa en uno
               item = item +1
               //además el item actual pasa a formar parte del primer elemento del siguiente item dentro del grupo
               grupos[item] = grupos[item].concat(objetos[objetos.length - 1])

               }else{//definitivamente es padre
               //se agrega al grupo al cual se define en el item
               grupos[item] = grupos[item].concat(objetos[objetos.length - 1])
               }

           }
       }
       else{//no existe el elemento anterior
       
       }    
     }
 const ruta:any[] = []
 let pathruta = "" 

 for(let i=0; i<grupos.length; i++){
   pathruta=""
     for(let j=0; j<grupos[i].length; j++){
       //console.log(arr[i][arr[i].length - j -1].nombreCarpeta)
       pathruta = pathruta +"/"+ grupos[i][grupos[i].length - j -1].titulo
       ruta.push(pathruta)
     }
 }
const grupoSinArraysEnBlanco = grupos.filter((val)=>val.length != 0)  
//console.log(grupoSinArraysEnBlanco)

for(let i =0;i<grupoSinArraysEnBlanco.length;i++){
 
  
  grupoRutas(grupoSinArraysEnBlanco[i]).map((val)=>{
   
   //concatena carpetas
   val.map((valor:ITitulo_subtitulo)=>{
    //reducir el tamaño del nombre de la carpeta

    otraruta = otraruta +"/"+valor.titulo
    rutaCorta = rutaCorta +"/"+valor.titulo.substring(0,18) 

    })
    //carpetas concatenadas
    mysRutas.push(otraruta)
    mysRutasCortas.push(rutaCorta)
     
    otraruta =""
    rutaCorta=""
     
   
  })
 

 
}

return {mysRutas,mysRutasCortas}

 }

 function grupoRutas(items:ITitulo_subtitulo[]){
   const nuevoItem:any[][]	=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
     
   for(let i =0; i<items.length;i++){
     const itertaciones =  items[i].columna
     for(let j=0; j<=itertaciones;j++){
       

       if(j === itertaciones){
         
         nuevoItem[i][j] = items[i]    
       }else{
         nuevoItem[i][j]={titulo:"",columna:j}
       }
     }
   }
   
   
   //busca segun columna el elemento a completar
   for(let m=0;m<nuevoItem.length;m++){
     for(let n=0;n<nuevoItem[m].length;n++){
       //modifica nuevoItem.nombreCarpeta
       //menos el ultimo elemento
       if(n != nuevoItem[m].length -1){
       

         let variable = items.find((val)=>val.columna === nuevoItem[m][n].columna)//"busqueda"
         
         if(variable !== undefined){
           nuevoItem[m][n] = items.find((val)=>val.columna === nuevoItem[m][n].columna)

         }
         
       }
     }
   }
   const valoresLimpios = nuevoItem.filter((val)=>val.length != 0)
   return valoresLimpios
 }
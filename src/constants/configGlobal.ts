/* eslint-disable prettier/prettier */
import  * as path from 'path';
export const parametros ={
    obra:{
        templates:{
            base:path.join(process.cwd(),'src/assets/'),
            configuracion:'plantilla_valorizacion.xlsx'
        }

    },
        valorizacion:{
            hojasXLS:{
                valorizacion_calculos:{
                    rutaPlantillla:"D:/addinexcel/sistema/backendv4/src/assets/plantilla_valorizacion_calculos.xlsx",
                    rutaBaseDestino:`${path.join(__dirname, '../../','/projects')}`,
                    nombre:"valorizacion_calculos",
                    fila_inicio_partidas:4,
                    filasCabecera:3,
                    separacion_partida_resumen_economico:4
                },
                cuadro_resumen_pago:{
                    nombre:"cuadro_resumen_pago"
                },
                ficha_identificacion:{
                    nombre:"ficha_identificacion"
                },
                curva_s:{
                    nombre:"curva_s"
                }   
            }   
        }
    
}
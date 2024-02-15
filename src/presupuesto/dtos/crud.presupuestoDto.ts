import { Partida } from "../entities/presupuesto.entity";

export class CreaPresupuestoDto{
    item:string;
    obraId:string
    partidas:Partida[]
}
export class ActualizaPresupuestoDto{
    
    partidas:Partida[]

}
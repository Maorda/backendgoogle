import { Partida } from "../entities/presupuesto.entity";

export class CreaPresupuestoDto{
    presupuestoId:string;
    obraId:string
    partidas:Partida[]
}
export class ActualizaPresupuestoDto{
    
    partidas:Partida[]

}
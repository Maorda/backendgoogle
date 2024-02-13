import { FilterQuery, UpdateQuery } from "mongoose"
import { CreaObraDto, listaObrasPorUsuarioIdDto } from "../dtos/crud.obra"
import { Obra } from "../entities/obra.entity"
//atencion con las proyeccciones elimino la parte sucia
export const  IOBRA_REPOSITORY = 'IObraRepository'
export interface IObraRepository{
    
    creaObra(creaObraDto:CreaObraDto):Promise<any>
    buscaById(
        entityFilterQuery: FilterQuery<Obra>,
        projection?: Record<string, unknown>
    ):Promise<any>
    
    buscaObraByusuarioId(
        entityFilterQuery: FilterQuery<Obra>,
        projection?: Record<string, unknown>
    ):Promise<any>
    
    buscaObraByusuarioIdAndObraId(
        entityFilterQuery: FilterQuery<Obra>,
        projection?: Record<string, unknown>
    ):Promise<Obra>


    actualizaObra(
        entityFilterQuery: FilterQuery<Obra>,
        updateEntityData: UpdateQuery<unknown>
    ):Promise<any>
    listaObras(entityFilterQuery: FilterQuery<Obra>):Promise<any[] | null> 
    
    
    listaObrasPorUsuarioId(
        entityFilterQuery: FilterQuery<listaObrasPorUsuarioIdDto>,
        projection?: Record<string, unknown>):Promise<Obra[] | null>
    
    
}
import { FilterQuery, UpdateQuery } from "mongoose"
import { AgregaevidenciafotograficaDto, CreateValorizacionDto } from "../dtos/crud.valorizacion.dto"

import { EvidenciaFotografica, Valorizacion } from "../entities/valorizacion.entity"

export const  IVALORIZACION_REPOSITORY = 'IValorizacionRepository'
export interface IValorizacionRepository{
    creaperiodovalorizacion(creaValorizacionDto:CreateValorizacionDto
    ):Promise<Valorizacion>
    
    buscaById(
        entityFilterQuery: FilterQuery<Valorizacion>,
        projection?: Record<string, unknown>
    ):Promise<any>

    buscaValorizacionByObraId(
        entityFilterQuery: FilterQuery<Valorizacion>,
        projection?: Record<string, unknown>
    ):Promise<Valorizacion | null>
    
    actualizaValorizacion(
        entityFilterQuery: FilterQuery<Valorizacion>,
        updateEntityData: UpdateQuery<unknown>
    ):Promise<Valorizacion>
    
    listaValorizaciones(entityFilterQuery: FilterQuery<Valorizacion>
    ):Promise<Valorizacion[] | null>

    agregaevidenciafotografica(
        evidenciaFotograficaDto:AgregaevidenciafotograficaDto,
    ):Promise<AgregaevidenciafotograficaDto>
    //actualizaciones
    actualizaEvidenciaFotografica(evidenciaFotograficaDto:AgregaevidenciafotograficaDto):Promise<any>

    
//consultas
dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId:string,mesSeleccionado:string):Promise<any>


}
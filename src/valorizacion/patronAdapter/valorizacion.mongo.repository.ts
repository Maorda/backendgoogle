import { InjectModel } from "@nestjs/mongoose";

import { EvidenciaFotografica, Periodo, Valorizacion } from "../entities/valorizacion.entity";
import { IValorizacionRepository } from "./valorizacion.interface";
import { randomUUID } from 'node:crypto';

import { FilterQuery, UpdateQuery } from "mongoose";
import { AgregaevidenciafotograficaDto, CreateValorizacionDto } from "../dtos/crud.valorizacion.dto";
import { ValorizacionModel } from "../schemas/valorizacion.schema";
import { ConflictException } from "@nestjs/common";





export class ValorizacionMongoRepository implements IValorizacionRepository{
    constructor(
        @InjectModel(Valorizacion.name) private valorizacionModel:ValorizacionModel 
    ){}
    
    async buscaValorizacionByObraId(entityFilterQuery: FilterQuery<Valorizacion>, projection?: Record<string, unknown>): Promise<Valorizacion | null> {
        
        return this.valorizacionModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        })
    }
    async creaperiodovalorizacion(creaValorizacionDto: CreateValorizacionDto): Promise<any> {
       console.log({"obraid":creaValorizacionDto.obraId.code})
       const nuevaValorizacion = new Valorizacion();
       
       nuevaValorizacion.obraId = creaValorizacionDto.obraId.code

       nuevaValorizacion.periodos = creaValorizacionDto.periodos
       
       let otraValorizacion  = await this.valorizacionModel.findOne({obraId:creaValorizacionDto.obraId.code})
       console.log({"resultado de buscar el obraid":otraValorizacion})
      
       if(otraValorizacion === null ){
        console.log("es una nueva valorizacion")
        await this.valorizacionModel.syncIndexes()//Hace que los índices en MongoDB coincidan con los índices definidos en el esquema de este modelo
        return this.valorizacionModel.create(nuevaValorizacion)
       }
       else{
        otraValorizacion.periodos.map((al,index)=>{
            if(al.mesSeleccionado === creaValorizacionDto.periodos[0].mesSeleccionado ){
                throw new ConflictException("PERIODO YA EXISTE")
            }
        })
        console.log("existe valorizacion")
        //valida el periodo seleccionado

        return await this.valorizacionModel.
            findOneAndUpdate(
                {obraId:nuevaValorizacion.obraId},//obra encontrada
                {
                    $push:{
                    "periodos":nuevaValorizacion.periodos[0]
                    }
                },
                {
                    new: true,overwrite:false
                },
                
            ).exec()

       }
    }
    async buscaById(entityFilterQuery: FilterQuery<Valorizacion>, projection?: Record<string, unknown>): Promise<any> {
        return this.valorizacionModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
    }
    actualizaValorizacion(entityFilterQuery: FilterQuery<Valorizacion>, updateEntityData: UpdateQuery<unknown>): Promise<Valorizacion> {
        throw new Error("Method not implemented.");
    }
    listaValorizaciones(entityFilterQuery: FilterQuery<Valorizacion>): Promise<any[]> {
        return this.valorizacionModel.find(entityFilterQuery).exec()
    }
    async agregaevidenciafotografica(
            evidenciaFotografica:AgregaevidenciafotograficaDto,
            
    ):Promise<AgregaevidenciafotograficaDto>{
        const nuevaEvidenciaFotografica = new AgregaevidenciafotograficaDto()
        nuevaEvidenciaFotografica.descripcionTrabajos =evidenciaFotografica.descripcionTrabajos;
        nuevaEvidenciaFotografica.partida=evidenciaFotografica.partida;
        nuevaEvidenciaFotografica.urlFoto=evidenciaFotografica.urlFoto;
        console.log({"evidenciaFotografica en reposytori":evidenciaFotografica})
        
        /*
            { <query conditions> },
            { <update operator>: { "<array>.$[<identifier>]" : value } },
            { arrayFilters: [ { <identifier>: <condition> } ] }
        */
      
        const macho:any = await this.valorizacionModel
            .findOneAndUpdate(
                {"obraId":evidenciaFotografica.obraId},
                {
                    
                    $push:{
                        "periodos.$[periodo].panelFotografico":{
                            $each:[nuevaEvidenciaFotografica],
                            $position:0

                        }
                        
                    }
                },
                {
                    arrayFilters:[{"periodo.mesSeleccionado":evidenciaFotografica.mesSeleccionado}]
                }
            )
            
            return macho
    }

    
    async listavalorizacionObraId(obraId:string):Promise<any>{
        return await this.valorizacionModel.findOne({"obraId":obraId}).exec()

    }
    //actualizaciones
    async actualizaEvidenciaFotografica(evidenciaFotografica:AgregaevidenciafotograficaDto): Promise<any> {
        const nuevaEvidenciaFotografica = new AgregaevidenciafotograficaDto()
        nuevaEvidenciaFotografica.descripcionTrabajos =evidenciaFotografica.descripcionTrabajos;
        nuevaEvidenciaFotografica.partida=evidenciaFotografica.partida;
        nuevaEvidenciaFotografica.urlFoto=evidenciaFotografica.urlFoto;
        console.log({"evidencia":evidenciaFotografica})
        return await this.valorizacionModel
            .findOneAndUpdate(
                {"obraId":evidenciaFotografica.obraId},
                {
                    
                    $set:{
                        "periodos.$[periodo].panelFotografico.$[panel].descripcionTrabajos":"actualizado con 01.02",
                        
                        
                    }
                },
                {
                    arrayFilters:[{"periodo.mesSeleccionado":"Diciembre"},{"panel.partida":"s"}]
                }
               
            )
    }

    //consultas
    async dadoUnMesSeleccionadoMostarSuPanelFotografico(obraId:string,mesSeleccionado:string){//no es necesario el usuarioId
        
        return await this.valorizacionModel.findOne({$and:[{"periodos.mesSeleccionado":mesSeleccionado,"obraId":obraId}]},
        {
            "periodos.$":1,
            "_id":0,
            }).exec()
    }
    
}
    
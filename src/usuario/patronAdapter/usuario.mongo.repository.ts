import { Injectable } from "@nestjs/common";
import { InjectModel, } from "@nestjs/mongoose";

import { UsuarioModel } from "../schema/usuario.schema";
import { IUsuarioRepository } from "./usuario.interface.repository";
import {  FilterQuery, UpdateQuery } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Usuario } from "../entities/entidad.usuario";
import { CreaUsuarioDto } from "../dtos/crud.usuario";

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository{
    constructor(
        @InjectModel(Usuario.name) private usuarioModel:UsuarioModel
    ){}
    listaUsuarios(entityFilterQuery: FilterQuery<Usuario>): Promise<any[] | null > {
        return this.usuarioModel.find(entityFilterQuery).exec()
    }
    async creaUsuario(creaUsuarioDto: CreaUsuarioDto): Promise<any> {
        const nuevoUsuario = new Usuario()
        
        nuevoUsuario.email = creaUsuarioDto.email;
        nuevoUsuario.password = creaUsuarioDto.password
        
        return await new this.usuarioModel(nuevoUsuario).save()
    }
    //userId: string
    //busca por {userId}
    async buscaById(
        entityFilterQuery: FilterQuery<Usuario>,
        projection?: Record<string, unknown>): Promise<any> {
        return this.usuarioModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
          
    }
    //(userId: string, userUpdates: UpdateUserDto) son los parametros
    //{ userId }, userUpdates, es o que ingresa es decir entityfilterquery
    async actualizaUsuario(
        entityFilterQuery: FilterQuery<Usuario>,
        updateEntityData: UpdateQuery<unknown>
        ): Promise<Usuario> {
        return this.usuarioModel.findOneAndUpdate(entityFilterQuery,
            updateEntityData,
            {
              new: true 
            })
    }
    
}
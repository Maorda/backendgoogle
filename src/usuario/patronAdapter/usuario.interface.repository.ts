import { FilterQuery, UpdateQuery } from "mongoose";
import { CreaUsuarioDto } from "../dtos/crud.usuario";
import { Usuario } from "../entities/entidad.usuario";

export const  IUSUARIO_REPOSITORY = 'IUsuarioRepository'
export interface IUsuarioRepository{
    creaUsuario(creaUsuarioDto:CreaUsuarioDto):Promise<Usuario>
    buscaById(
        entityFilterQuery: FilterQuery<Usuario>,
        projection?: Record<string, unknown>
    ):Promise<Usuario>
    actualizaUsuario(
        entityFilterQuery: FilterQuery<Usuario>,
        updateEntityData: UpdateQuery<unknown>
    ):Promise<Usuario>
    listaUsuarios(entityFilterQuery: FilterQuery<Usuario>):Promise<Usuario[]> 

    



}
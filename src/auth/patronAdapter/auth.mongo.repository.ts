import { Injectable } from "@nestjs/common";
import { InjectModel, } from "@nestjs/mongoose";
import mongoose,{  FilterQuery, UpdateQuery } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Usuario } from "src/usuario/entities/entidad.usuario";
import { AuthDto } from "../dtos/auth.dto";
import { AuthEntity, AuthFindOne } from "../entity/auth.entity";
import { AuthModel} from "../schema/auth.schema";
import { IAuthRepository } from "./auth.interface.repository";


@Injectable()
export class AuthMongoRepository implements IAuthRepository{
    constructor(
        @InjectModel(AuthEntity.name) private authModel:AuthModel
    ){}
    
    lista(): Promise<any[]> {
        return this.authModel.find({}).exec()
    }
    findOne(entityFilterQuery: FilterQuery<AuthFindOne>, projection?: Record<string, unknown>): Promise<any> {
        return this.authModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
    }
    async register(registra: AuthDto): Promise<any> {
        const nuevoUsuario = new this.authModel()//crea o general el ObjectId ;_id
        nuevoUsuario.email = registra.email;
        nuevoUsuario.password = registra.password
        nuevoUsuario.usuarioId = nuevoUsuario._id
        
        return await new this.authModel(nuevoUsuario).save()
    }
    
    async login(
        entityFilterQuery: FilterQuery<AuthEntity>,
        projection?: Record<string, unknown>): Promise<any> {
        return this.authModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
          
    }
       
}
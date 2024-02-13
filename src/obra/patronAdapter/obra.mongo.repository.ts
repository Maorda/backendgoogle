import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import * as mongoose from 'mongoose'
import { CreaObraDto, listaObrasPorUsuarioIdDto } from '../dtos/crud.obra';
import { Obra } from '../entities/obra.entity';
import { ObraModel } from '../schema/obra.schema';
import { IObraRepository } from './obra.interface';

export class ObraMongoRepository implements IObraRepository{
    constructor(
        @InjectModel(Obra.name) private obraModel:ObraModel
    ){}
    buscaObraByusuarioIdAndObraId(entityFilterQuery: FilterQuery<Obra>, projection?: Record<string, unknown>): Promise<Obra> {
        return this.obraModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
    }
    listaObrasPorUsuarioId(
        entityFilterQuery: FilterQuery<listaObrasPorUsuarioIdDto>,
        projection?: Record<string, unknown>
        ):Promise<Obra[]>{
        return this.obraModel.find( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()    
        
    }
    
    async creaObra(creaObraDto: CreaObraDto): Promise<any> {
        const nuevaObra = new Obra();
        // se deberia crear en el cliente, puesto que se va a abrir el archivo excel que determina a una determinada obra del usuario.
        nuevaObra.obraId = new mongoose.Types.ObjectId().toString() ; 
        nuevaObra.usuarioId = creaObraDto.usuarioId;
        nuevaObra.logoUrl = creaObraDto.logoUrl;
        console.log({"nueva obra":nuevaObra})
        
        return await new this.obraModel(nuevaObra).save()
        
    }
    async buscaById(
        entityFilterQuery: FilterQuery<Obra>,
        projection?: Record<string, unknown>): Promise<any> {
        return this.obraModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
          
    }
    //retorna una obra del usuario logeado
    //en caso no tenga obras

    async buscaObraByusuarioId(
        entityFilterQuery: FilterQuery<any>,
        projection?: Record<string, unknown>): Promise<any> {
        return this.obraModel.findOne( entityFilterQuery,{
            _id: 0,
            __v: 0,
            ...projection
        }).exec()
          
    }


    async actualizaObra(
        entityFilterQuery: FilterQuery<Obra>,
        updateEntityData: UpdateQuery<unknown>
        ): Promise<Obra> {
        return this.obraModel.findOneAndUpdate(entityFilterQuery,
            updateEntityData,
            {
              new: true 
            })
    }
    async listaObras(entityFilterQuery: FilterQuery<Obra>): Promise<any[]> {
        return this.obraModel.find(entityFilterQuery).exec()
    }
    
}
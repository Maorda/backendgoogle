import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, {  Document, Model } from 'mongoose'


@Schema()
class UsuarioSchema {
    @Prop({type:mongoose.Schema.Types.ObjectId})
    usuarioId:string;
    @Prop()
    email:string;
    @Prop()
    password:string;
} 
export const USUARIO_SCHEMA =  SchemaFactory.createForClass(UsuarioSchema)
export type UsuarioDocument = UsuarioSchema & Document
export type UsuarioModel = Model<UsuarioSchema>


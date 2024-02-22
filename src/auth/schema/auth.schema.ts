import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, {  Document, Model } from 'mongoose'


@Schema()
class AuthSchema {
    @Prop({type: mongoose.Schema.Types.ObjectId})
    usuarioId: mongoose.Types.ObjectId;
    @Prop()
    email:string;
    @Prop()
    password:string;
    @Prop()
    usuarioFolderId:string
 
   

} 
export const AUTH_SCHEMA =  SchemaFactory.createForClass(AuthSchema)
export type AuthDocument = AuthSchema & Document
export type AuthModel = Model<AuthSchema>
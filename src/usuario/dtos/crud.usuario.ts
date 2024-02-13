import { IsString } from "class-validator"
export class CreaUsuarioDto{
    @IsString()
    email:string
    @IsString()
    password:string
}
export class listaUsuariosDto{}
export class ActualizaUsuarioDto{}
export class EliminaUsuarioDto{}
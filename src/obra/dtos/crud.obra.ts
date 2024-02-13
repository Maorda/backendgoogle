import { IsString } from "class-validator"
import { Obra } from "../entities/obra.entity";
export class CreaObraDto{
    @IsString()
    usuarioId:string;
    @IsString()
    logoUrl:string
    
    
}
export class listaObrasPorUsuarioIdDto{
    @IsString()
    usuarioId:string;
 
}

export class EliminaObraDto{}
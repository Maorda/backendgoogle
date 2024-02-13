import { Inject, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { ActualizaUsuarioDto, CreaUsuarioDto } from '../dtos/crud.usuario';
import { Usuario } from '../entities/entidad.usuario';
import { IUsuarioRepository, IUSUARIO_REPOSITORY } from '../patronAdapter/usuario.interface.repository';

@Injectable()
export class UsuarioService {
    constructor(
        @Inject(IUSUARIO_REPOSITORY) private iusuarioRepository:IUsuarioRepository
    ){}
    async creaUsuario(creaUsuarioDto: CreaUsuarioDto): Promise<Usuario> {
        return await  this.iusuarioRepository.creaUsuario(creaUsuarioDto)
    }
    async buscaById(usuarioId:string ): Promise<Usuario> {
        return await this.iusuarioRepository.buscaById({usuarioId})
    }
    async actualizaUsuario(usuarioId:string, actualizaUsuarioDto:ActualizaUsuarioDto): Promise<Usuario> {
        return await this.iusuarioRepository.actualizaUsuario({usuarioId},actualizaUsuarioDto)
    }
    async listaUsuarios(){
        return await this.iusuarioRepository.listaUsuarios({})
    }
}

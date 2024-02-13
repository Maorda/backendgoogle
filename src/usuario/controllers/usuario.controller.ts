import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreaUsuarioDto, ActualizaUsuarioDto } from '../dtos/crud.usuario';
import { Usuario } from '../entities/entidad.usuario';
import { UsuarioService } from '../services/servicios.usuario';

@Controller('usuario')
export class UsuarioController {
    constructor(
        private usuarioservice:UsuarioService
    ){}
    //rutas staticas
    @Get("lista")
    async getUsers(): Promise<Usuario[]> {
        return this.usuarioservice.listaUsuarios();
    }
    @Get("listausuarios1")
    async getUsers1(): Promise<Usuario[]> {
        return this.usuarioservice.listaUsuarios();
    }
    @Get("accion")
    async adicional():Promise<string>{
        console.log("adicional")
        return "adicional"
    }
    //rutas dinamicas
    @Get(':login')
    async getUser(@Param('login') userId: string): Promise<Usuario> {
        console.log({
            userId
        })
      return this.usuarioservice.buscaById(userId);
    }
    
    
    @Post('creausuario')
    async createUser(@Body() creaUsuarioDto: CreaUsuarioDto): Promise<Usuario> {
        
        //inicio hardcode 
        const nuevoUsuario:CreaUsuarioDto = {
            email:"myemail@gmail.com",
            password:"123"
        }
        //creaUsuarioDto = nuevoUsuario
        //fin

        return this.usuarioservice.creaUsuario(creaUsuarioDto)
    }
      
    @Patch(':usuarioId')
    async updateUser(@Param('usuarioId') usuarioId: string, @Body() actualizaUsuarioDto: ActualizaUsuarioDto): Promise<Usuario> {
        return this.usuarioservice.actualizaUsuario(usuarioId, actualizaUsuarioDto);
    }
    
  
   
}

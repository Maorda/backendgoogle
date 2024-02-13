import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario } from './entities/entidad.usuario';
import { IUSUARIO_REPOSITORY } from './patronAdapter/usuario.interface.repository';
import { UsuarioMongoRepository } from './patronAdapter/usuario.mongo.repository';
import { USUARIO_SCHEMA } from './schema/usuario.schema';
import { UsuarioService } from './services/servicios.usuario';
import { UsuarioController } from './controllers/usuario.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[
        
        JwtModule.register({
            secret:jwtConstants.secret,
            signOptions:{expiresIn:'1d'}
          }),
        MongooseModule.forFeature(
        [
            {
                name:Usuario.name,schema:USUARIO_SCHEMA
            }
        ])
],
providers: [UsuarioService,{provide:IUSUARIO_REPOSITORY,useClass:UsuarioMongoRepository}],
controllers: [UsuarioController]})
export class UsuarioModule {}

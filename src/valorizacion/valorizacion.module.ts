import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValorizacionController } from './controllers/valorizacion.controller';
import { ValorizacionEntity } from './entities/valorizacion.entity';
import { IVALORIZACION_REPOSITORY } from './patronAdapter/valorizacion.interface';
import { ValorizacionMongoRepository } from './patronAdapter/valorizacion.mongo.repository';
import { VALORIZACION_SCHEMA } from './schemas/valorizacion.schema';
import { ValorizacionService } from './services/valorizacion.servicio';
import { CalculosController } from './calculos/calculos.controller';
import { SeparadoresController } from './separadores/separadores.controller';
import { IsUniqueConstraint } from 'src/constraints/fieldUnique';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { LoggingInterceptor } from 'src/auth/services/interceptortoken.service';
import { JwtauthguardService } from 'src/auth/services/jwtauthguard.service';
import { JwtstrategyService } from 'src/auth/services/jwtstrategy.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { IAUTH_REPOSITORY } from 'src/auth/patronAdapter/auth.interface.repository';
import { AuthMongoRepository } from 'src/auth/patronAdapter/auth.mongo.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TokenInterceptor } from './services/intersepta_Token';
import { AuthService } from 'src/auth/services/auth.service';
import { PictureInterceptor } from './services/pictureInterceptor';
import { HttpModule } from "@nestjs/axios";
import { ObraModule } from 'src/obra/obra.module';
import { ObraService } from 'src/obra/services/obra.servicio';
@Module({
  imports:[
    HttpModule,
    AuthModule,
    ObraModule,
    

    MongooseModule.forFeature([{name:ValorizacionEntity.name,schema:VALORIZACION_SCHEMA}]),
      JwtModule.register({
        secret:jwtConstants.secret,
        signOptions:{expiresIn:'1d'}
      }),

      
  ],
  providers: [
    IsUniqueConstraint,
    ValorizacionService,
    ObraService,
    {provide:IVALORIZACION_REPOSITORY,useClass:ValorizacionMongoRepository},
    JwtstrategyService, JwtauthguardService, LoggingInterceptor,PictureInterceptor
    ],
  controllers: [ValorizacionController, CalculosController, SeparadoresController]
})
export class ValorizacionModule {}

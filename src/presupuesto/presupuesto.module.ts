import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObraEntity } from 'src/obra/entities/obra.entity';
import { OBRA_SCHEMA } from 'src/obra/schema/obra.schema';
import { PresupuestoController } from './controllers/presupuesto.controller';
import { Presupuesto } from './entities/presupuesto.entity';
import { IPRESUPUESTO_REPOSITORY } from './patronAdapter/presupuesto.interface';
import { PresupuestoMongoRepository } from './patronAdapter/presupuesto.mongo.repository';
import { PRESUPUESTO_SCHEMA } from './schema/presupuesto.schema';
import { PresupuestoService } from './services/presupuesto.servicio';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Presupuesto.name,schema:PRESUPUESTO_SCHEMA,
        
      },
      {
        name:ObraEntity.name,schema:OBRA_SCHEMA
      }
    ])
  ],
  controllers: [PresupuestoController],
  providers: [PresupuestoService,{provide:IPRESUPUESTO_REPOSITORY,useClass:PresupuestoMongoRepository}]
  
})
export class PresupuestoModule {

}

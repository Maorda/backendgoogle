import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreaPresupuestoDto } from '../dtos/crud.presupuestoDto';
import { Presupuesto } from '../entities/presupuesto.entity';
import { PresupuestoService } from '../services/presupuesto.servicio';
@Controller('presupuesto')
export class PresupuestoController {
    constructor(
        private presupuestoService:PresupuestoService
    ){}
    @Get(':obraId')
    async getPresupuestoByObraId(@Param('obraId') obraId: string): Promise<Presupuesto> {
      return this.presupuestoService.buscaById(obraId);
    }
  /*
    @Get()
    async getPresuestos(): Promise<Presupuesto[]> {
        return this.presupuestoService.listaPresupuestos();
    }*/
  
    @Post('creapresupuesto')
    async createPresupuesto(@Body() creaPresupuestoDto: any)
    : Promise<Presupuesto> {
        
        const nuevoPresupuesto:CreaPresupuestoDto = {
            presupuestoId:randomUUID(),
            obraId:creaPresupuestoDto.obraId,
	        partidas: creaPresupuestoDto.partidas 
        }
            creaPresupuestoDto = nuevoPresupuesto

        return this.presupuestoService.creaPresupuesto(creaPresupuestoDto)
        
    }
  
    /*@Patch(':presupuestoId')
    async updatePresupuesto(@Param('presupuestoId') presupuestoId: string, @Body() actualizaPresupuestoDto: ActualizaPresupuestoDto): Promise<Presupuesto> {
        return this.presupuestoService.actualizaPresupuesto(presupuestoId, actualizaPresupuestoDto);
    }*/
}

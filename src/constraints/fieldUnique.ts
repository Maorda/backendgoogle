import { Inject, Injectable } from '@nestjs/common';
import { getModelToken,InjectModel } from '@nestjs/mongoose';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments,registerDecorator, ValidationOptions } from 'class-validator';
import { Valorizacion } from 'src/valorizacion/entities/valorizacion.entity';
import { IValorizacionRepository, IVALORIZACION_REPOSITORY } from 'src/valorizacion/patronAdapter/valorizacion.interface';
import { ValorizacionModel } from 'src/valorizacion/schemas/valorizacion.schema';

// decorator options interface
export type IsUniqeInterface = {
    tableName: string,
    column: string
}
//funciona
@ValidatorConstraint({name: 'IsUniqueConstraint', async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(
        //@InjectModel(Valorizacion.name) private readonly valorizacionModel:ValorizacionModel
        @Inject(IVALORIZACION_REPOSITORY) private ivalorizacionRepository:IValorizacionRepository
        ) {}
    async validate(
        value: any,
        args?: ValidationArguments
        ): Promise<boolean> {
            const filter = {};
            console.log({"validando":"validnado desde el constraint custom"})

            
            console.log(getModelToken(Valorizacion.name));
            filter[args.property] = value;
            const count = await this.ivalorizacionRepository.listaValorizaciones({});
            return !count;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        // return custom field message
        const field: string = validationArguments.property
        return `${field} is already exist`
    }
}

// decorator function
export function isUnique(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}
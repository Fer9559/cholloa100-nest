import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";
import { isFloat32Array, isStringObject } from "util/types";

export class CreateCholloDto {

    @IsString({message: 'El mensaje debe ser un string'})
    @MinLength(3)
    titulo: string;

    @IsNotEmpty({ message: 'El valor no puede estar vacío.' })
    @IsNumber({}, { message: 'El valor debe ser un número.' })
    @Min(0, { message: 'El número debe ser positivo o igual a 0.' })
    precio: number;

    @IsString({message: 'El mensaje debe ser un string'})
    @MinLength(5)
    enlace: string;

    @IsString({message: 'El mensaje debe ser un string'})
    @MinLength(3)
    descripcion: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCholloDto } from './create-chollo.dto';

export class UpdateCholloDto extends PartialType(CreateCholloDto) {}

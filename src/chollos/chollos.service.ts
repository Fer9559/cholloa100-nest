import { Injectable } from '@nestjs/common';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';

@Injectable()
export class ChollosService {
  create(createCholloDto: CreateCholloDto) {
    return 'This action adds a new chollo';
  }

  findAll() {
    return `This action returns all chollos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chollo`;
  }

  update(id: number, updateCholloDto: UpdateCholloDto) {
    return `This action updates a #${id} chollo`;
  }

  remove(id: number) {
    return `This action removes a #${id} chollo`;
  }
}

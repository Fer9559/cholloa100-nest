import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';
import { Chollos } from './entities/chollo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChollosService {


  constructor(
    @InjectRepository(Chollos)
    private readonly cholloRepository: Repository<Chollos>,
  ) {}


  async create(createCholloDto: CreateCholloDto) {
    
    try {
      
      const chollo = this.cholloRepository.create(createCholloDto);
      await this.cholloRepository.save(chollo);
      
      return chollo;
      
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Ayuda')
    }
    
  }

  findAll() {
    return ;
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

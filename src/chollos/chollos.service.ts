import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';
import { Chollos } from './entities/chollo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CholloImage } from './entities';

@Injectable()
export class ChollosService {

private readonly logger = new Logger('ChollosService')

  constructor(
    @InjectRepository(Chollos)
    private readonly cholloRepository: Repository<Chollos>,
    
    @InjectRepository(CholloImage)
    private readonly CholloImageRepository: Repository<CholloImage>,
  ) {}


  async create(createCholloDto: CreateCholloDto) {  
    try {
      const {images = [], ...cholloDetails} = createCholloDto;

      const chollo = this.cholloRepository.create({
        ...cholloDetails,
        images: images.map( image => this.CholloImageRepository.create({url: image}))
      });
      await this.cholloRepository.save(chollo);
      
      return { ...chollo, images};
      
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  }


  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0} = paginationDto;
    
    const chollos = await this.cholloRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })
    return chollos.map( chollo =>({
      ...chollo, 
      images: chollo.images.map( img => img.url)
    }))
  }


  async findOneOrMore( term: string ) {

    let chollos: Chollos[] = [];

    if ( isUUID(term)){
      const chollo = await this.cholloRepository.findOneBy({ id_chollo: term});
      if (chollo) {
        chollos.push(chollo); // Agrega el resultado si se encontró
      }
    } else {
      chollos = await this.cholloRepository.createQueryBuilder('chollo')
      .where('UPPER(chollo.titulo) LIKE :titulo', {
        titulo: `%${term.toUpperCase()}%`
      })
      .leftJoinAndSelect('chollo.images','cholloImages')
      .getMany();
    }
    
    if (chollos.length === 0)
      throw new NotFoundException(`Chollos con el nombre ${term} no encontrados`);

    return chollos;
  }


  async findOneOrMorePlain( term: string ) {
    const chollos = await this.findOneOrMore( term );
    return chollos.map(({ images = [], ...rest}) => ({
      ...rest,
      images: images.map( image => image.url ),
    }));
  }


  async update(id: string, updateCholloDto: UpdateCholloDto) {
    const chollo = await this.cholloRepository.preload({
      id_chollo: id,
      ...updateCholloDto,
      images: [],
    });

    if (!chollo) throw new NotFoundException(`Chollo con id: ${id} no encontrado`);
    
    try {
    await this.cholloRepository.save(chollo)
    return chollo;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async remove(id_chollo: string) {
    if (isUUID(id_chollo)) {
    const chollo = await this.findOneOrMore(id_chollo);

    await this.cholloRepository.remove(chollo);
    } 
    else {
      throw new NotFoundException(`Chollo con UUID ${id_chollo} no encontrado`);
    }
  }


  private handleDBExceptions(error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';
import { Chollos } from './entities/chollo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CholloImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ChollosService {
  [x: string]: any;

private readonly logger = new Logger('ChollosService')

  constructor(
    @InjectRepository(Chollos)
    private readonly cholloRepository: Repository<Chollos>,
    
    @InjectRepository(CholloImage)
    private readonly CholloImageRepository: Repository<CholloImage>,
    private readonly dataSource: DataSource,
  ) {}


  async create(createCholloDto: CreateCholloDto, user: User) {  
    try {
      const {images = [], ...cholloDetails} = createCholloDto;

      const chollo = this.cholloRepository.create({
        ...cholloDetails,
        images: images.map( image => this.CholloImageRepository.create({url: image})),
        user,
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


  async findUserChollos(userId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
        // Verificamos que el ID de usuario sea válido
        if (!isUUID(userId)) {
            throw new BadRequestException(`El ID de usuario ${userId} no es válido.`);
        }

        this.logger.log(`Buscando chollos para el usuario ID: ${userId}`);

        const chollos = await this.cholloRepository.find({
            where: { user: { id_user: userId } }, // Filtrar por ID de usuario
            relations: ['images'], // Incluimos las imágenes relacionadas
            take: limit, // Limite para la paginación
            skip: offset, // Offset para la paginación
        });

        // Comprobar si se encontraron chollos
        if (chollos.length === 0) {
            throw new NotFoundException(`Chollos no encontrados para el usuario con ID: ${userId}`);
        }

        return chollos.map(chollo => ({
            ...chollo,
            images: chollo.images.map(image => image.url), // Retornamos las URLs de las imágenes
        }));

    } catch (error) {
        this.handleDBExceptions(error);
    }
}

  async update(id: string, updateCholloDto: UpdateCholloDto, user: User) {
    const { images, ...toUpdate } = updateCholloDto;
    
    const chollo = await this.cholloRepository.preload({
       id_chollo: id, ...toUpdate });

    if (!chollo) throw new NotFoundException(`Chollo con id: ${id} no encontrado`);
    
    //create query runner (transacción)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images){
        await queryRunner.manager.delete( CholloImage, { chollo: {id_chollo: id}} );

        chollo.images = images.map( 
          image => this.CholloImageRepository.create({ url: image})
        );
      } 

      chollo.user = user;
      await queryRunner.manager.save(chollo);
      await queryRunner.commitTransaction();
      await queryRunner.release();

     // await this.cholloRepository.save(chollo);
     //se llama a la funcion findOneOrMorePlain para que me devuelva los datos de las 
     //imágenes mapeadas como quiero
      return this.findOneOrMorePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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

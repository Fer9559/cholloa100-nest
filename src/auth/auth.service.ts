import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';

import *as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  
  constructor(
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) {}
  

  async create(createUserDto: CreateUserDto) {
    
    try {
      
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      
      await this.userRepository.save(user)
      delete user.password;

      //Devolver el Jason Web Token de Acceso
      return {
        ...user,
        token: this.getJwtToken({id_user: user.id_user})
      };

    } catch (error) {
      
      this.handleDBErrors(error);

    }
  }


  async login(loginUserDto: LoginUserDto){

    const{ password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id_user: true }
    });

    if(!user)
      throw new UnauthorizedException('Credenciales incorrectas, por favor vuelva a introducirlas(no existe ningún usuario con ese email).');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas, por favor vuelva a introducirlas(no coincide la contraseña).');
    
    console.log({user})

    return {
      ...user,
      token: this.getJwtToken({id_user: user.id_user})
    };
    //devuelve el JWT
  }


  private getJwtToken(playload: JwtPayload){

    const token = this.jwtService.sign(playload);
    return token;

  }


  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException('Algo salió mal, por favor revise los logs');
  }

}

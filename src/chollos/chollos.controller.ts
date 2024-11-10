import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ChollosService } from './chollos.service';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';
import { query } from 'express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('chollos')
export class ChollosController {
  constructor(private readonly chollosService: ChollosService) {}

  @Post('create')
  @Auth()
  create(
    @Body() createCholloDto: CreateCholloDto,
    @GetUser() user: User,
  ) {
    return this.chollosService.create(createCholloDto, user);
  }

  @Get('list-all')
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto)
    return this.chollosService.findAll(paginationDto);
  }

  @Get('filter-by-title/:term')
  findOne(@Param('term') term: string) {
    return this.chollosService.findOneOrMorePlain(term);
  }

  @Get('user-chollos/:id')
  @Auth()  // Protegemos la ruta, permitiendo solo a usuarios autenticados acceder
  async getUserChollos(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.chollosService.findUserChollos(id, paginationDto);
  }

  @Patch('update-chollo/:id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCholloDto: UpdateCholloDto,
    @GetUser() user: User,
  ) {
    return this.chollosService.update(id, updateCholloDto, user);
  }

  @Delete('delete-chollo/:id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id_chollo: string) {
    return this.chollosService.remove(id_chollo);
  }
}

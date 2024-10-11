import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ChollosService } from './chollos.service';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';
import { query } from 'express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRoles } from 'src/auth/interfaces';

@Controller('chollos')
export class ChollosController {
  constructor(private readonly chollosService: ChollosService) {}

  @Post()
  @Auth(validRoles.user)
  create(@Body() createCholloDto: CreateCholloDto,) {
    return this.chollosService.create(createCholloDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto)
    return this.chollosService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.chollosService.findOneOrMorePlain(term);
  }

  @Patch(':id')
  @Auth(validRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCholloDto: UpdateCholloDto) {
    return this.chollosService.update(id, updateCholloDto);
  }

  @Delete(':id')
  @Auth(validRoles.user)
  remove(@Param('id', ParseUUIDPipe) id_chollo: string) {
    return this.chollosService.remove(id_chollo);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChollosService } from './chollos.service';
import { CreateCholloDto } from './dto/create-chollo.dto';
import { UpdateCholloDto } from './dto/update-chollo.dto';

@Controller('chollos')
export class ChollosController {
  constructor(private readonly chollosService: ChollosService) {}

  @Post()
  create(@Body() createCholloDto: CreateCholloDto) {
    return this.chollosService.create(createCholloDto);
  }

  @Get()
  findAll() {
    return this.chollosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chollosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCholloDto: UpdateCholloDto) {
    return this.chollosService.update(+id, updateCholloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chollosService.remove(+id);
  }
}

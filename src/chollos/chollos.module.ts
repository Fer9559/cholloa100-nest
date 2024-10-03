import { Module } from '@nestjs/common';
import { ChollosService } from './chollos.service';
import { ChollosController } from './chollos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chollos } from './entities/chollo.entity';

@Module({
  controllers: [ChollosController],
  providers: [ChollosService],
  imports: [
    TypeOrmModule.forFeature([Chollos])
  ]
})
export class ChollosModule {}

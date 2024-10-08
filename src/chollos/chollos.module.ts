import { Module } from '@nestjs/common';
import { ChollosService } from './chollos.service';
import { ChollosController } from './chollos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chollos, CholloImage } from './entities';


@Module({
  controllers: [ChollosController],
  providers: [ChollosService],
  imports: [
    TypeOrmModule.forFeature([Chollos, CholloImage])
  ],
  exports: [
    ChollosService,
    TypeOrmModule,
  ]
})
export class ChollosModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChollosModule } from './chollos/chollos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,

    }),

    ChollosModule,

    CommonModule,

    AuthModule
  ],
})
export class AppModule { }

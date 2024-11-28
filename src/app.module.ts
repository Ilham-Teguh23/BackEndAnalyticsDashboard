import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from "dotenv"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as yup from 'yup';
import { RouteMapsModule } from './route-maps/route-maps.module';
import { TbDataset } from './route-maps/route-maps.entity';

dotenv.config()

const envSchema = yup.object({
  DB_HOST: yup.string().required('Environment variable DB_HOST is required'),
  DB_PORT: yup
    .number()
    .required('Environment variable DB_PORT is required')
    .typeError('DB_PORT must be a valid number'),
  DB_USER: yup.string().required('Environment variable DB_USER is required'),
  DB_PASSWORD: yup
    .string()
    .required('Environment variable DB_PASSWORD is required'),
  DB_DATABASE: yup
    .string()
    .required('Environment variable DB_DATABASE is required'),
});

const validatedEnv = envSchema.validateSync(process.env, { abortEarly: false });

@Module({
  imports: [
    RouteMapsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: validatedEnv.DB_HOST,
      username: validatedEnv.DB_USER,
      password: validatedEnv.DB_PASSWORD,
      database: validatedEnv.DB_DATABASE,
      entities: [TbDataset],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

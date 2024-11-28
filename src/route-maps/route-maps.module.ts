import { Module } from "@nestjs/common";
import { RouteMapsController } from "./route-maps.controllers";
import { RouteMapsService } from "./route-maps.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TbDataset } from "./route-maps.entity";

@Module({
    imports: [TypeOrmModule.forFeature([TbDataset])],
    controllers: [RouteMapsController],
    providers: [RouteMapsService]
})

export class RouteMapsModule {}
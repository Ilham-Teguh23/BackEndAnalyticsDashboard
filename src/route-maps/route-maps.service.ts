import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { TbDataset } from "./route-maps.entity";
import { Repository } from "typeorm";

@Injectable()
export class RouteMapsService {

    private readonly apiUrl = 'https://data.cityofnewyork.us/resource/gkne-dk5s.json'

    constructor(
        @InjectRepository(TbDataset)
        private readonly datasetRepository: Repository<TbDataset>,
    ) { }

    async fetchAndStoreData(): Promise<{statusCode: number, message: string}> {
        try {
            const response = await axios.get(this.apiUrl);
            const data = response.data;

            for (const item of data) {
                const newDataset = this.datasetRepository.create({
                    payment_type: item.payment_type,
                    trip_distance: item.trip_distance,
                    fare: item.fare_amount,
                    pickup_longitude: item.pickup_longitude,
                    pickup_latitude: item.pickup_latitude,
                    dropoff_longitude: item.dropoff_longitude,
                    dropoff_latitude: item.dropoff_latitude,
                    pickup_datetime: item.pickup_datetime ? new Date(item.pickup_datetime) : null,
                    dropoff_datetime: item.dropoff_datetime ? new Date(item.dropoff_datetime) : null,
                });

                await this.datasetRepository.save(newDataset);
            }

            return {
                statusCode: 200,
                message: "Data Berhasil Diterima dan Disimpan di Database"
            }
            
        } catch (error) {
            console.log(error);
            
            throw new HttpException(
                'Gagal Untuk Mendapatkan Data',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async fetchData(): Promise<TbDataset[]> {
        try {
            const data = await this.datasetRepository.find()
            return data
        } catch (error) {
            throw new HttpException(
                'Gagal Untuk Fetch Data',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

}
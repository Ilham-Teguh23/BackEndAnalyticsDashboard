import { HttpException, HttpStatus, Injectable, NotFoundException, } from "@nestjs/common";
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

    async fetchData(
        offset: number, 
        limit: number,
        paymentType?: string,
        fareAmount?: string,
        tripDistance?: string
    ): Promise<[TbDataset[], number]> {
        try {
            const queryBuilder = this.datasetRepository.createQueryBuilder('dataset')
            .skip(offset)
            .take(limit)

            if (paymentType) {
                queryBuilder.andWhere('dataset.payment_type = :paymentType', { paymentType });
            }

            if (fareAmount) {
                let fareRangeStart = 0;
                let fareRangeEnd = 0;

                if (fareAmount === "1") {
                    fareRangeStart = 0
                    fareRangeEnd = 10
                } else if (fareAmount === "2") {
                    fareRangeStart = 11
                    fareRangeEnd = 20
                } else if (fareAmount === "3") {
                    fareRangeStart = 21
                    fareRangeEnd = 30
                } else if (fareAmount === "4") {
                    fareRangeStart = 31
                    fareRangeEnd = 40
                } else if (fareAmount === "5") {
                    fareRangeStart = 41
                    fareRangeEnd = 50
                } else if (fareAmount === "6") {
                    fareRangeStart = 51
                    fareRangeEnd = 60
                } else if (fareAmount === "7") {
                    fareRangeStart = 61
                    fareRangeEnd = 70
                } else if (fareAmount === "8") {
                    fareRangeStart = 71
                    fareRangeEnd = 80
                } else if (fareAmount === "9") {
                    fareRangeStart = 81
                    fareRangeEnd = 90
                } else if (fareAmount === "10") {
                    fareRangeStart = 91
                    fareRangeEnd = 100
                } else {
                    fareRangeStart = 1
                    fareRangeEnd = 100
                }

                queryBuilder.andWhere('dataset.fare BETWEEN :fareRangeStart AND :fareRangeEnd', {
                    fareRangeStart,
                    fareRangeEnd
                });
            }

            if (tripDistance) {
                let tripDistanceStart = 0;
                let tripDistanceEnd = 0;

                if (tripDistance === "1") {
                    tripDistanceStart = 0
                    tripDistanceEnd = 10
                } else if (tripDistance === "2") {
                    tripDistanceStart = 11
                    tripDistanceEnd = 20
                } else if (tripDistance === "3") {
                    tripDistanceStart = 21
                    tripDistanceEnd = 30
                } else if (tripDistance === "4") {
                    tripDistanceStart = 31
                    tripDistanceEnd = 40
                } else if (tripDistance === "5") {
                    tripDistanceStart = 41
                    tripDistanceEnd = 50
                } else if (tripDistance === "6") {
                    tripDistanceStart = 51
                    tripDistanceEnd = 60
                } else if (tripDistance === "7") {
                    tripDistanceStart = 61
                    tripDistanceEnd = 70
                } else if (tripDistance === "8") {
                    tripDistanceStart = 71
                    tripDistanceEnd = 80
                } else if (tripDistance === "9") {
                    tripDistanceStart = 81
                    tripDistanceEnd = 90
                } else if (tripDistance === "10") {
                    tripDistanceStart = 91
                    tripDistanceEnd = 100
                } else {
                    tripDistanceStart = 1
                    tripDistanceEnd = 100
                }

                queryBuilder.andWhere('dataset.trip_distance BETWEEN :tripDistanceStart AND :tripDistanceEnd', {
                    tripDistanceStart,
                    tripDistanceEnd
                });
            }

            const [data, total] = await queryBuilder.getManyAndCount();

            return [data, total];
        } catch (error) { 
            console.log(error);
            
            throw new HttpException(
                'Gagal Untuk Fetch Data',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async showData(id: number) : Promise<{ statusCode: number, message: string, data: TbDataset }> {
        
        try {
            const entry = await this.datasetRepository.findOne({where: {id}})
            
            if (!entry) {
                throw new NotFoundException(`Data with ID ${id} not found`);
            }
            
            return {
                statusCode: 200,
                message: "Berhasil Mendapatkan Data",
                data: entry
            }
        } catch (error) {
            
            console.log(error);
            
            throw new Error(
                `Gagal Untuk Mendapatkan Data : ${error.message}`
            )
        }
    }

}
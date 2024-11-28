import { Controller, Get } from "@nestjs/common";
import { RouteMapsService } from "./route-maps.service";

@Controller("route-maps")
export class RouteMapsController {

    constructor(
        private readonly routeMapsService: RouteMapsService
    ) { }

    @Get()
    async getData() {
        try {

            const data = await this.routeMapsService.fetchData()
            return {
                statusCode: 200,
                message: "Berhasil Mendapatkan Data",
                data
            }

        } catch (error) {

            return {
                statusCode: 500,
                message: "Gagal Untuk Mendapatkan Data",
                error: error.message
            }

        }
    }

    @Get("data-set")
    async getDataset(): Promise<{statusCode: number, message: string}> {
        return await this.routeMapsService.fetchAndStoreData()
    }

}
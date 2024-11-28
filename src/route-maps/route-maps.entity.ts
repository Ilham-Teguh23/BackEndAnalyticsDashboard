import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_dataset", { schema: "public" })
export class TbDataset {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text", nullable: false })
    payment_type: string

    @Column({ type: "numeric", precision: 20, scale: 18, nullable: true })
    trip_distance: string

    @Column({ type: "numeric", precision: 20, scale: 0, nullable: true })
    fare: string

    @Column({ type: "numeric", precision: 20, scale: 18, nullable: true })
    pickup_longitude: string

    @Column({ type: "numeric", precision: 20, scale: 18, nullable: true })
    pickup_latitude: string

    @Column({ type: "numeric", precision: 20, scale: 18, nullable: true })
    dropoff_longitude: string

    @Column({ type: "numeric", precision: 20, scale: 18, nullable: true })
    dropoff_latitude: string

    @Column({ type: "timestamp", nullable: true })
    pickup_datetime: Date

    @Column({ type: "timestamp", nullable: true })
    dropoff_datetime: Date
}
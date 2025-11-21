import { Entity,Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { GrMaster } from "./gr-master.entity";

@Entity('good_receipt_detail_new')
export class GrDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sr_no: number;

    @Column()
    prod_id: string;

    @Column()
    prod_qty: number;

    @ManyToOne(()=> GrMaster, (grMaster) => grMaster.gr_details)
    @JoinColumn({ name: 'gr_master_id'})
    gr_master: GrMaster;

    @Column('uuid')
    gr_master_id: string;
}
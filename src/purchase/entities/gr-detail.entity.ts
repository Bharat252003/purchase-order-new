import { Entity,Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { GrMaster } from "./gr-master.entity";

@Entity('good_receipt_detail')
export class GrDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    grn_sr: number;

    @Column()
    prod_id: string;

    @Column()
    prod_qty: number;

    @ManyToOne(()=> GrMaster, (grMaster) => grMaster.gr_details)
    gr_master: GrMaster;

    @Column('uuid')
    gr_master_id: string;
}
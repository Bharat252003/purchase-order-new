import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { PoMaster } from "./po-master.entity";
import { GrDetail } from "./gr-detail.entity";

@Entity('good_receipt_master')
export class GrMaster{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    grn_date: Date;

    @Column()
    grn_no: string;

    @Column()
    sup_id: string;

    @Column('uuid')
    po_master_id: string;

    @OneToMany(() => GrDetail, (grDetails)=> grDetails.gr_master)
    gr_details: GrDetail[];

    @ManyToOne(() => PoMaster, (poMaster)=> poMaster.gr_master)
    po_master: PoMaster;


}
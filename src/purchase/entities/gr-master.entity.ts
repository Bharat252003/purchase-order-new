import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { PoMaster } from "./po-master.entity";
import { GrDetail } from "./gr-detail.entity";

@Entity('good_receipt_master_new')
export class GrMaster{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
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
    @JoinColumn({ name: 'po_master_id'})
    po_master: PoMaster;

}
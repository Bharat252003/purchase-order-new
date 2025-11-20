import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PoDetail } from "./po-detail.entity";
import { GrMaster } from "./gr-master.entity";

@Entity('purchase_order_master')
export class PoMaster{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    po_no: string;

    @Column()
    po_date: Date;

    @Column()
    sup_id: string;

    @Column({default: 0})
    po_rev: number;

    @Column()
    po_rev_reason: string;

    @Column({default: true})
    is_active: boolean;

    @Column()
    po_amount: number;

    @OneToMany(() => PoDetail, (poDetail) => poDetail.po_master)
    po_details: PoDetail[];

    @OneToMany(() => GrMaster, (grMaster)=> grMaster.po_master)
    gr_master: GrMaster[];
}
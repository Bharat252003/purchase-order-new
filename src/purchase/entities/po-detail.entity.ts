import { Entity,Column,PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PoMaster } from "./po-master.entity";

@Entity('purchase_order_detail')
export class PoDetail{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    prod_id: string;

    @Column()
    prod_qty: number;

    // @Column()
    // prod_rec_qty: number;

    // @Column()
    // prod_adj_qty: number;

    @Column()
    prod_rate: number;

    @Column()
    total_amount: number;

    @ManyToOne(() => PoMaster, (poMaster) => poMaster.po_details)
    po_master: PoMaster;

    @Column('uuid')
    po_master_id: string;

}
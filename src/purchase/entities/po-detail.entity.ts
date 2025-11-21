import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PoMaster } from "./po-master.entity";

@Entity('purchase_order_detail_new')
export class PoDetail{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sr_no: number;

    @Column()
    prod_id: string;

    @Column()
    prod_qty: number;

    // @Column()
    // prod_rec_qty: number;

    // @Column()
    // prod_adj_qty: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    prod_rate: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    total_amount: number;

    @ManyToOne(() => PoMaster, (poMaster) => poMaster.po_details)
    @JoinColumn({ name: 'po_master_id' }) 
    po_master: PoMaster;

    @Column('uuid')
    po_master_id: string;

}
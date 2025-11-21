import { Entity,Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity('purchase_order_master_mongo_new')
export class PoMasterMongo{
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    po_no: string;

    @Column({ type: 'date' })
    po_date: Date;

    @Column()
    sup_id: string;

    @Column({default: 0})
    po_rev: number;

    @Column({default: ''})
    po_rev_reason: string;

    @Column({default: true})
    is_active: boolean;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    po_amount: number;

    // @OneToMany(() => PoDetail, (poDetail) => poDetail.po_master)
    // po_details: PoDetail[];

    // @OneToMany(() => GrMaster, (grMaster)=> grMaster.po_master)
    // gr_master: GrMaster[];
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PoMaster } from './entities/po-master.entity';
import { PoDetail } from './entities/po-detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GrMaster } from './entities/gr-master.entity';
import { GrDetail } from './entities/gr-detail.entity';
import { CreatePoDto } from './dto/create-po.dto';
import { DataSource } from 'typeorm';
import { CreateGrDto } from './dto/create-gr.dto';
import { AmendPoDto } from './dto/amend-po.dto';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(PoMaster)
        private readonly poRepo: Repository<PoMaster>,
        @InjectRepository(PoDetail)
        private readonly poDetailRepo: Repository<PoDetail>,
        @InjectRepository(GrMaster)
        private readonly grRepo: Repository<GrMaster>,
        @InjectRepository(GrDetail)
        private readonly grDetailRepo: Repository<GrDetail>,
        private readonly dataSource: DataSource,
    ) { }

    async createPo(createPoDto: CreatePoDto) {
        return await this.dataSource.transaction(async (manager) => {
            const poMaster = manager.getRepository(PoMaster).create({
                po_no: createPoDto.po_no,
                po_date: createPoDto.po_date,
                sup_id: createPoDto.sup_id,
            })

            const savedPoMaster = await manager.getRepository(PoMaster).save(poMaster)

            let total_amount = 0;
            const poDetails = createPoDto.po_details.map((item, index) => {
                const detail = manager.getRepository(PoDetail).create({
                    sr_no: index + 1,
                    prod_id: item.prod_id,
                    prod_qty: item.prod_qty,
                    prod_rate: item.prod_rate,
                    po_master_id: savedPoMaster.id,
                    total_amount: item.prod_qty * item.prod_rate
                })

                total_amount += detail.total_amount
                return detail;
            })
            await manager.getRepository(PoDetail).save(poDetails);

            savedPoMaster.po_amount = total_amount;
            await manager.getRepository(PoMaster).save(savedPoMaster);

            return { message: 'Purchase Order created successfully', po_id: savedPoMaster.id }
        })
    }

    async getAllPo() {
        return this.poRepo.find({ relations: ['po_details', 'gr_master'] });
    }

    async createGrn(createGrnDto: CreateGrDto) {
        return await this.dataSource.transaction(async (manager) => {

            const grMaster = manager.getRepository(GrMaster).create({
                grn_no: createGrnDto.grn_no,
                grn_date: createGrnDto.grn_date,
                sup_id: createGrnDto.sup_id,
                po_master_id: createGrnDto.po_master_id
            })
            const savedGrMaster = await manager.getRepository(GrMaster).save(grMaster)

            console.log(savedGrMaster.id)
            const grDetails = createGrnDto.gr_details.map((item, index) => {
                const detail = manager.getRepository(GrDetail).create({
                    sr_no: index + 1,
                    prod_id: item.prod_id,
                    prod_qty: item.prod_qty,
                    gr_master_id: savedGrMaster.id
                })
                return detail;
            })

            await manager.getRepository(GrDetail).save(grDetails);

            return { message: 'Goods Receipt Note created successfully', gr_id: savedGrMaster.id }

        })

    }

    async getAllGrn() {
        return this.grRepo.find({ relations: ['gr_details'] });
        // return this.grRepo.find({ relations: ['gr_details', 'po_master'] });
    }

    async amendPo(amendPoDto: AmendPoDto, poNo: string) {
        return await this.dataSource.transaction(async (manager) => {
            const activePo = await manager.getRepository(PoMaster).findOne({ where: { po_no: poNo, is_active: true } });
            if (!activePo) throw new NotFoundException("PO not found");

            await this.poRepo.update({ po_no: poNo }, { is_active: false });

            const amendedPoMaster = manager.getRepository(PoMaster).create({
                po_no: poNo,
                po_date: amendPoDto.poDate,
                sup_id: amendPoDto.supId,
                po_rev_reason: amendPoDto.poRevReason,
                po_rev: activePo.po_rev + 1,
            })

            const savedAmendedPoMaster = await manager.getRepository(PoMaster).save(amendedPoMaster);

            const amendedPoDetails = amendPoDto.poDetails.map((item, index) => {
                const detail = manager.getRepository(PoDetail).create({
                    sr_no: index + 1,
                    prod_id: item.prod_id,
                    prod_qty: item.prod_qty,
                    prod_rate: item.prod_rate,
                    po_master_id: savedAmendedPoMaster.id,
                    total_amount: item.prod_qty * item.prod_rate
                })
                return detail;
            })

            await manager.getRepository(PoDetail).save(amendedPoDetails);

            let total_amount = amendedPoDetails.reduce((sum, detail) => sum + detail.total_amount, 0);
            savedAmendedPoMaster.po_amount = total_amount;
            await manager.getRepository(PoMaster).save(savedAmendedPoMaster);

            return { message: 'Purchase Order amended successfully', po_id: savedAmendedPoMaster.id }
        })
    }

    async getPoReport(poNo: string) {

        // const latestPo = await this.poRepo
        //     .createQueryBuilder('po')
        //     .where('po.po_no = :po_no', { poNo })
        //     .andWhere('po.is_active = true')
        //     .orderBy('po.revision_no', 'DESC')
        //     .getOne();

        // if (!latestPo) {
        //     throw new NotFoundException('Purchase Order not found');
        // }

        // const allGrns = await this.grDetailRepo
        //     .createQueryBuilder('grd')
        //     .innerJoin('grd.gr_master', 'grm')
        //     .where('grm.po_no = :po_no', { poNo })
        //     .getMany();

        // const poDetails = latestPo.po_details;

        // const grnReceivedMap = {}; // product_id → total received qty

        // allGrns.forEach(gr => {
        //     if (!grnReceivedMap[gr.prod_id]) grnReceivedMap[gr.prod_id] = 0;
        //     grnReceivedMap[gr.prod_id] += gr.prod_qty;
        // });

        // const report = poDetails.map(item => {
        //     const received = grnReceivedMap[item.prod_id] || 0;

        //     return {
        //         productId: item.prod_id,
        //         orderedQty: item.prod_qty,
        //         receivedQty: received,
        //         remainingQty: item.prod_qty - received
        //     };
        // });



        const allPOs = await this.poRepo.find({
            where: { po_no: poNo },
            relations: ['po_details']
        });

        const latestPO = allPOs
            .filter(po => po.is_active)
            .sort((a, b) => b.po_rev - a.po_rev)[0];

        const poIds = allPOs.map(po => po.id);

        const allGrnDetails = await this.grDetailRepo
            .createQueryBuilder('grd')
            .innerJoin('grd.gr_master', 'grm')
            .where('grm.po_master_id IN (:...poIds)', { poIds })
            .getMany();

        const poDetails = latestPO.po_details;

        const receivedMap = {};

        for (const gr of allGrnDetails) {
            if (!receivedMap[gr.prod_id]) receivedMap[gr.prod_id] = 0;
            receivedMap[gr.prod_id] += gr.prod_qty;
        }


        const report = poDetails.map(item => {
            const received = receivedMap[item.prod_id] || 0;

            return {
                productId: item.prod_id,
                orderedQty: item.prod_qty,
                receivedQty: received,
                remainingQty: item.prod_qty - received
            };
        });

        // delete latestPO.po_details;
        return {...latestPO, report};

    }
}

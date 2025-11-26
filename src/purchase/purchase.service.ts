import { Injectable, NotFoundException } from '@nestjs/common';
import { PoMaster } from './entities/po-master.entity';
import { PoDetail } from './entities/po-detail.entity';
import { Repository, In } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GrMaster } from './entities/gr-master.entity';
import { GrDetail } from './entities/gr-detail.entity';
import { CreatePoDto } from './dto/create-po.dto';
import { DataSource } from 'typeorm';
import { CreateGrDto } from './dto/create-gr.dto';
import { AmendPoDto } from './dto/amend-po.dto';
import { PoMasterMongo } from './entities/po-master.entity-mongo';
import { plainToInstance } from 'class-transformer';
import { AllPoReportDto } from './dto/po-master-report.dto';
import { PoResponseDto } from './dto/response/po-response.dto';
import { GrnResponseDto } from './dto/response/gr-response.dto';
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
        // @InjectRepository(PoMasterMongo, 'mongodb')
        // private readonly poMasterMongoRepo: Repository<PoMasterMongo>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        // @InjectDataSource('mongodb')
        // private readonly mongoDataSource: DataSource,
    ) { }

    async createPo(createPoDto: CreatePoDto) {
        return await this.dataSource.transaction(async (manager) => {
            const poNoCheck = await manager.getRepository(PoMaster).find({ where: { po_no: createPoDto.po_no } })
            if (poNoCheck.length > 0) throw new NotFoundException("PO with No " + createPoDto.po_no + " is already present");

            const poMaster = manager.getRepository(PoMaster).create({
                po_no: createPoDto.po_no,
                po_date: createPoDto.po_date,
                sup_id: createPoDto.sup_id,
            })

            const savedPoMaster = await manager.getRepository(PoMaster).save(poMaster)
            // const savedPoMongo = await this.poMasterMongoRepo.save({
            //     _id: savedPoMaster.id,
            //     po_no: savedPoMaster.po_no,
            //     sup_id: savedPoMaster.sup_id,
            //     po_date: savedPoMaster.po_date,
            // });

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
        const allPos = await this.poRepo.find({ relations: ['po_details'] })
        const result = plainToInstance(PoResponseDto, allPos, {
            excludeExtraneousValues: true,
        });
        return result;
    }

    async getPoById(po_id: string) {
        const Po = await this.poRepo.findOne({ relations: ['po_details'], where: { id: po_id } })
        const result = plainToInstance(PoResponseDto, Po, {
            excludeExtraneousValues: true,
        });
        return result;
    }

    async createGrn(createGrnDto: CreateGrDto) {
        return await this.dataSource.transaction(async (manager) => {

            const grnNoCheck = await manager.getRepository(PoMaster).find({ where: { po_no: createGrnDto.grn_no } })
            if (grnNoCheck.length > 0) throw new NotFoundException("GRN with No " + createGrnDto.grn_no + " is already present");

            const latestPO = await this.poRepo.findOne({
                where: { id: createGrnDto.po_master_id },
                relations: ['po_details']
            });

            if (!latestPO) {
                throw new NotFoundException('Purchase Order not found with given ID ' + createGrnDto.po_master_id);
            }

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

            // fetch all GR masters for this PO and then fetch details by their ids
            const allGrnMaster = await manager.getRepository(GrMaster).find({
                relations: ['gr_details'],
                where: {
                    po_master_id: createGrnDto.po_master_id
                }
            });

            let allGrnDetails: GrDetail[] = [];

            allGrnMaster.forEach((master) => {
                allGrnDetails.push(...master.gr_details);
            });


            const poDetails = latestPO.po_details;

            const receivedMap = {};

            for (const gr of allGrnDetails) {
                if (!receivedMap[gr.prod_id]) receivedMap[gr.prod_id] = 0;
                receivedMap[gr.prod_id] += gr.prod_qty;
            }
            let totalPendingQty = 0;

            poDetails.map(item => {
                const received = receivedMap[item.prod_id] || 0;
                totalPendingQty += item.prod_qty - (item.adj_qty + received);
            });

            if(totalPendingQty <= 0){
                latestPO.is_active = false;
                await manager.getRepository(PoMaster).save(latestPO);
                console.log("PO  — fully received");
            }

            console.log("total pending qty is ", totalPendingQty);

            return { message: 'Goods Receipt Note created successfully', gr_id: savedGrMaster.id }m 
        })

    }

    async getAllGrn() {
        const allGRNs = await this.grRepo.find({ relations: ['gr_details'] });

        return plainToInstance(GrnResponseDto, allGRNs, {
            excludeExtraneousValues: true,
        });
    }

    async amendPo(amendPoDto: AmendPoDto, poId: string) {
        return await this.dataSource.transaction(async (manager) => {
            const activePo = await manager.getRepository(PoMaster).findOne({ where: { id: poId, is_active: true } });
            if (!activePo) throw new NotFoundException("PO with id " + poId + " not active or does not exist");

            await this.poRepo.update({ id: poId }, { is_active: false });

            // setting the old po adj _qty to the remaining qty

            const activePoDetails = await manager.getRepository(PoDetail).find({
                where: { po_master_id: activePo.id }
            });

            const allGrnMaster = await this.grRepo.find({ where: { po_master_id: poId } });

            let grnDetails: GrDetail[] = [];
            if (allGrnMaster && allGrnMaster.length > 0) {
                const grIds = allGrnMaster.map(g => g.id);
                grnDetails = await this.grDetailRepo.find({
                    where: { gr_master_id: In(grIds) },
                    select: ['id', 'prod_id', 'prod_qty', 'sr_no', 'gr_master_id'] as any,
                });
            }


            // const poDetails = latestPO.po_details;

            const receivedMap = {};

            for (const gr of grnDetails) {
                if (!receivedMap[gr.prod_id]) receivedMap[gr.prod_id] = 0;
                receivedMap[gr.prod_id] += gr.prod_qty;
            }


            for (const detail of activePoDetails) {
                const received = receivedMap[detail.prod_id] ?? 0;
                const remaining = detail.prod_qty - received;

                detail.adj_qty = remaining;  // store remaining qty into adj_qty
            }

            await manager.getRepository(PoDetail).save(activePoDetails);

            // creating new po with amedment

            const amendedPoMaster = manager.getRepository(PoMaster).create({
                po_no: activePo.po_no,
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

    async getPoReportById(poId: string) {

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



        const latestPO = await this.poRepo.findOne({
            where: { id: poId },
            relations: ['po_details']
        });

        if (!latestPO) {
            throw new NotFoundException('Purchase Order not found');
        }

        // const latestPO = allPOs
        //     .filter(po => po.is_active)
        //     .sort((a, b) => b.po_rev - a.po_rev)[0];

        // const poIds = allPOs.map(po => po.id);

        // fetch all GR masters for this PO and then fetch details by their ids
        const allGrnMaster = await this.grRepo.find({ where: { po_master_id: poId } });

        let allGrnDetails: GrDetail[] = [];
        if (allGrnMaster && allGrnMaster.length > 0) {
            const grIds = allGrnMaster.map(g => g.id);
            allGrnDetails = await this.grDetailRepo.find({
                where: { gr_master_id: In(grIds) },
                select: ['id', 'prod_id', 'prod_qty', 'sr_no', 'gr_master_id'] as any,
            });
        }



        const poDetails = latestPO.po_details;

        const receivedMap = {};

        for (const gr of allGrnDetails) {
            if (!receivedMap[gr.prod_id]) receivedMap[gr.prod_id] = 0;
            receivedMap[gr.prod_id] += gr.prod_qty;
        }
        let totalReceivedQty = 0;
        let totalOrderedQty = 0;
        let totalAdjustedQty = 0;
        let totalPendingQty = 0;

        const report = poDetails.map(item => {
            const received = receivedMap[item.prod_id] || 0;
            totalReceivedQty += received;
            totalOrderedQty += item.prod_qty;
            totalAdjustedQty += item.adj_qty;
            totalPendingQty += item.prod_qty - (item.adj_qty + received);

            item['receivedQty'] = received;
            item['pendingQty'] = item.prod_qty - (item.adj_qty + received);
            // return {
            //     productId: item.prod_id,
            //     orderedQty: item.prod_qty,
            //     receivedQty: received,
            //     adjustedQty: item.adj_qty,
            //     remainingQty: item.prod_qty - (item.adj_qty + received)
            // };

        });
        let reports: any = { ...latestPO, totalReceivedQty, totalOrderedQty, totalAdjustedQty, totalPendingQty };
        const result = plainToInstance(AllPoReportDto, reports, {
            excludeExtraneousValues: true,
        });

        // delete latestPO.po_details;
        return result;
    }
    async getAllPoReport() {

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



        const allPos = await this.poRepo.find({
            relations: ['po_details']
        });

        if (!allPos || allPos.length === 0) {
            throw new NotFoundException('Purchase Order not found');
        }

        let reports: any[] = [];

        for (const latestPO of allPos) {

            const allGrnMaster = await this.grRepo.find({ where: { po_master_id: latestPO.id } });

            let allGrnDetails: GrDetail[] = [];
            if (allGrnMaster && allGrnMaster.length > 0) {
                const grIds = allGrnMaster.map(g => g.id);
                allGrnDetails = await this.grDetailRepo.find({
                    where: { gr_master_id: In(grIds) },
                    select: ['id', 'prod_id', 'prod_qty', 'sr_no', 'gr_master_id'] as any,
                });
            }



            const poDetails = latestPO.po_details;

            const receivedMap = {};

            for (const gr of allGrnDetails) {
                if (!receivedMap[gr.prod_id]) receivedMap[gr.prod_id] = 0;
                receivedMap[gr.prod_id] += gr.prod_qty;
            }
            let totalReceivedQty = 0;
            let totalOrderedQty = 0;
            let totalAdjustedQty = 0;
            let totalPendingQty = 0;
            // latestPO.po_details.

            const report = poDetails.map(item => {
                const received = receivedMap[item.prod_id] || 0;
                totalReceivedQty += received;
                totalOrderedQty += item.prod_qty;
                totalAdjustedQty += item.adj_qty;
                totalPendingQty += item.prod_qty - (item.adj_qty + received);

                item['receivedQty'] = received;
                item['pendingQty'] = item.prod_qty - (item.adj_qty + received);

                // return {
                //     productId: item.prod_id,
                //     orderedQty: item.prod_qty,
                //     receivedQty: received,
                //     adjustedQty: item.adj_qty,
                //     remainingQty: item.prod_qty - (item.adj_qty + received)
                // };

            });

            reports.push({ ...latestPO, totalReceivedQty, totalOrderedQty, totalAdjustedQty, totalPendingQty });
        }
        const result = plainToInstance(AllPoReportDto, reports, {
            excludeExtraneousValues: true,
        });


        // delete latestPO.po_details;
        return result;
    }


}

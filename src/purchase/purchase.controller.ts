import { Body, Controller, Post,Get, Param } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePoDto } from './dto/create-po.dto';
import { CreateGrDto } from './dto/create-gr.dto';
import { AmendPoDto } from './dto/amend-po.dto';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService){}

    @Post()
    async createPurchaseOrder(@Body() createPoData: CreatePoDto){
        return this.purchaseService.createPo(createPoData)
    }

    @Get()
    async getAllPurchaseOrders(){
        return this.purchaseService.getAllPo();
    }

    @Post('grn')
    async createGrn(@Body() createGrData: CreateGrDto){
        return this.purchaseService.createGrn(createGrData);
    }

    @Get('grn')
    async getAllGrn(){
        return this.purchaseService.getAllGrn();
    }

    @Post('amend/:po_id')
    async amendPo(@Body() amendPoData: AmendPoDto, @Param('po_id') po_id: string){
        return this.purchaseService.amendPo(amendPoData, po_id);
    }

    @Get('report/:po_id')
    async getPoReport(@Param('po_id') po_id: string){
        return this.purchaseService.getPoReportById(po_id);
    }

    @Get('report')
    async getAllPoReport(){
        return this.purchaseService.getAllPoReport();
    }
}

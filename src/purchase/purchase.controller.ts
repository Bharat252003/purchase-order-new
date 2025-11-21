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

    @Post('amend/:po_no')
    async amendPo(@Body() amendPoData: AmendPoDto, @Param('po_no') po_no: string){
        return this.purchaseService.amendPo(amendPoData, po_no);
    }

    @Get('report/:po_no')
    async getPoReport(@Param('po_no') po_no: string){
        return this.purchaseService.getPoReport(po_no);
    }
}

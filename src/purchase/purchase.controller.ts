import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePoDto } from './dto/create-po.dto';
import { CreateGrDto } from './dto/create-gr.dto';
import { AmendPoDto } from './dto/amend-po.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllPoReportDto } from './dto/po-master-report.dto';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }
    @ApiResponse({
        status: 201,
        description: 'Create a new Purchase Order',
        schema: {
            example: {
                message: 'Purchase Order created successfully',
                po_id: '123e4567-e89b-12d3-a456-426614174000'
            }
        }
    })
    @ApiOperation({ summary: 'Create a new purchase order' })
    @Post()
    async createPurchaseOrder(@Body() createPoData: CreatePoDto) {
        return this.purchaseService.createPo(createPoData)
    }

    @ApiOperation({ summary: 'Get all Purchase Orders' })
    @ApiResponse({
        status: 200,
        description: 'PO List',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '9b690c7f-ee07-4ef7-8250-5fe79effe021' },
                po_no: { type: 'string', example: 'p-0001' },
                po_date: { type: 'string', example: '2025-11-21' },
                sup_id: { type: 'string', example: 's-002' },
                po_rev: { type: 'number', example: 0 },
                po_rev_reason: { type: 'string', example: '' },
                is_active: { type: 'boolean', example: false },
                po_amount: { type: 'string', example: '55000.00' },

                po_details: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: '893c4647-d6c5-4a8a-bbe7-e7fbe70b5a8f' },
                            sr_no: { type: 'number', example: 1 },
                            prod_id: { type: 'string', example: 'p-1' },
                            prod_qty: { type: 'number', example: 50 },
                            adj_qty: { type: 'number', example: 0 },
                            prod_rate: { type: 'string', example: '100.00' },
                            total_amount: { type: 'string', example: '5000.00' },
                            po_master_id: {
                                type: 'string',
                                example: '9b690c7f-ee07-4ef7-8250-5fe79effe021',
                            },
                        },
                    },
                },
            },
        },
    })
    @Get()
    async getAllPurchaseOrders() {
        return this.purchaseService.getAllPo();
    }
    @ApiOperation({ summary: 'Create a new Goods Receipt Note' })
    @ApiCreatedResponse({
        description: 'Goods Receipt Note created successfully',
        schema: {
            example: {
                message: 'Goods Receipt Note created successfully',
                gr_id: '123e4567-e89b-12d3-a456-426614174000'
            }
        }
    })
    @Post('grn')
    async createGrn(@Body() createGrData: CreateGrDto) {
        return this.purchaseService.createGrn(createGrData);
    }

    @ApiOperation({ summary: 'Get all Goods Receipt Notes' })
    @ApiOkResponse({
        description: 'GRN List',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '092b779f-1254-4f52-8de3-5336b98a0599',
                    },
                    grn_date: {
                        type: 'string',
                        example: '2025-11-21',
                    },
                    grn_no: {
                        type: 'string',
                        example: 'G-0001',
                    },
                    sup_id: {
                        type: 'string',
                        example: 's-001',
                    },
                    po_master_id: {
                        type: 'string',
                        example: '9b690c7f-ee07-4ef7-8250-5fe79effe021',
                    },

                    gr_details: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    example: 'a8740089-7c09-4a03-96ad-03b7f8104497',
                                },
                                sr_no: {
                                    type: 'number',
                                    example: 1,
                                },
                                prod_id: {
                                    type: 'string',
                                    example: 'p-1',
                                },
                                prod_qty: {
                                    type: 'number',
                                    example: 50,
                                },
                                gr_master_id: {
                                    type: 'string',
                                    example: '092b779f-1254-4f52-8de3-5336b98a0599',
                                },
                            },
                        },
                    },
                },
            },
        }
    })
    @Get('grn')
    async getAllGrn() {
        return this.purchaseService.getAllGrn();
    }

    @ApiOperation({ summary: 'Amend an existing Purchase Order' })
    @ApiParam({ name: 'po_id', example: 'po-uuid-id' })
    @ApiBody({ type: AmendPoDto })
    @ApiResponse({
        status: 200,
        description: 'Purchase Order amended successfully',
        schema: {
            example: {
                message: 'Purchase Order amended successfully',
                po_id: '123e4567-e89b-12d3-a456-426614174000'
            }
        }
    })
    @Post('amend/:po_id')
    async amendPo(@Body() amendPoData: AmendPoDto, @Param('po_id') po_id: string) {
        return this.purchaseService.amendPo(amendPoData, po_id);
    }

    @ApiOperation({ summary: 'Get single Purchase Order report by ID' })
    @ApiParam({ name: 'po_id', example: 'po-uuid-id' })
    @ApiResponse({
        status: 200,
        type: AllPoReportDto,
        description: 'Single PO report',
    })
    @Get('report/:po_id')
    async getPoReport(@Param('po_id') po_id: string) {
        return this.purchaseService.getPoReportById(po_id);
    }

    @ApiOperation({ summary: 'Get all Purchase Order Reports' })
    @ApiOkResponse({
        description: 'Retrieve all Purchase Order Reports',
        type: [AllPoReportDto],
    })
    @Get('report')
    async getAllPoReport() {
        return this.purchaseService.getAllPoReport();
    }
}

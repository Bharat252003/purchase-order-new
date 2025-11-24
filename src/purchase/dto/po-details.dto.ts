import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, isNotEmpty, IsNotEmpty, IsNumber, isNumber, IsUUID } from "class-validator";

export class PoDetailsDto {
    @ApiProperty({
        name: 'prod_id',
        type: String,
        description: 'Product ID',
        example: 'p-1'
    })
    @IsNotEmpty()
    prod_id: string;

    @ApiProperty({
        name: 'prod_qty',
        type: Number,
        description: 'Product Quantity',
        example: 50
    })
    @IsNumber()
    prod_qty: number;

    @ApiProperty({
        name: 'prod_rate',
        type: Number,
        description: 'Product Rate',
        example: 100
    })
    @IsNumber()
    prod_rate: number;

    // @IsNumber()
    // total_amount: number;

    // @IsNotEmpty()
    // @IsUUID()
    // po_master_id: string;


}
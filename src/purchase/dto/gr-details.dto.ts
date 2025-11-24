import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GrDetailsDto {
    // @IsNotEmpty()
    // @IsUUID()
    // gr_master_id: string;
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
    @IsNotEmpty()
    prod_qty: number;
}
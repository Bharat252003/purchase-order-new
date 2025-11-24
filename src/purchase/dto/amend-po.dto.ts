import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PoDetailsDto } from "./po-details.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AmendPoDto {

    // @IsNotEmpty()
    // poNo: string;
    @ApiProperty({
            name: 'poDate',
            type: String,
            description: 'Purchase Order Date',
            example: '2024-10-01',
        })
    @IsDateString()
    poDate: Date;

    @ApiProperty({
            name: 'supId',
            type: String,
            description: 'Supplier ID',
            example: 's-002',
        })
    @IsNotEmpty()
    supId: string;
    
    @ApiProperty({
        name: 'poRevReason',
        type: String,
        description: 'Purchase Order Revision Reason',
        example: 'Change in product quantity',
    })
    @IsOptional()
    poRevReason?: string;

    @ApiProperty({type: [PoDetailsDto], description: 'Purchase Order item details'})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PoDetailsDto)
    poDetails: PoDetailsDto[];


}
import { IsArray, IsDateString, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PoDetailsDto } from "./po-details.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePoDto {
    @ApiProperty({
        name: 'po_no',
        type: String,
        description: 'Purchase Order Number',
        example: 'PO-001',
    })
    @IsNotEmpty()
    po_no: string;

    @ApiProperty({
        name: 'po_date',
        type: String,
        description: 'Purchase Order Date',
        example: '2024-10-01',
    })
    @IsDateString()
    po_date: Date;


    @ApiProperty({
        name: 'sup_id',
        type: String,
        description: 'Supplier ID',
        example: 's-001',
    })
    @IsNotEmpty()
    sup_id: string;

    @ApiProperty({type: [PoDetailsDto], description: 'purchse order item details'})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PoDetailsDto)
    po_details: PoDetailsDto[];

}
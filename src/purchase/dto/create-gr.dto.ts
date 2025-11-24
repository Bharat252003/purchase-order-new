import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { GrDetailsDto } from "./gr-details.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGrDto {
    @ApiProperty({
        name: 'grn_no',
        type: String,
        description: 'Goods Receipt Note Number',
        example: 'GRN-001',
    })
    @IsNotEmpty()
    grn_no: string;

    @ApiProperty({
        name: 'grn_date',
        type: String,
        description: 'Goods Receipt Note Date',
        example: '2024-10-01',
    })
    @IsDateString()
    grn_date: Date;

    @ApiProperty({
        name: 'sup_id',
        type: String,
        description: 'Supplier ID',
        example: 's-001',
    })
    @IsNotEmpty()
    sup_id: string;

    @ApiProperty({
        name: 'po_master_id',
        type: String,
        description: 'Purchase Order Master ID',
        example: '9c5101e3-83c7-47e1-bee3-641d7f2b0220',
    })
    @IsNotEmpty()
    @IsUUID()
    po_master_id: string;

    @ApiProperty({type: [GrDetailsDto], description: 'Goods Receipt Note item details'})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GrDetailsDto)
    gr_details: GrDetailsDto[];
}
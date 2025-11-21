import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { GrDetailsDto } from "./gr-details.dto";

export class CreateGrDto {
    @IsDateString()
    grn_date: Date;

    @IsNotEmpty()
    sup_id: string;

    @IsNotEmpty()
    grn_no: string;

    @IsNotEmpty()
    @IsUUID()
    po_master_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GrDetailsDto)
    gr_details: GrDetailsDto[];
}
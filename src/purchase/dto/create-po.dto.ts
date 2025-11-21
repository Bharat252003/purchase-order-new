import { IsArray, IsDateString, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PoDetailsDto } from "./po-details.dto";

export class CreatePoDto {

    @IsNotEmpty()
    po_no: string;

    @IsDateString()
    po_date: Date;

    @IsNotEmpty()
    sup_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PoDetailsDto)
    po_details: PoDetailsDto[];


}
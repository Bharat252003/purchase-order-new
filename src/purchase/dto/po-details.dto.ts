import { IsDateString, isNotEmpty, IsNotEmpty, IsNumber, isNumber, IsUUID } from "class-validator";

export class PoDetailsDto {
    @IsNotEmpty()
    prod_id: string;

    @IsNumber()
    prod_qty: number;

    @IsNumber()
    prod_rate: number;

    // @IsNumber()
    // total_amount: number;

    // @IsNotEmpty()
    // @IsUUID()
    // po_master_id: string;


}
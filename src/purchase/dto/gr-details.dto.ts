import { IsNotEmpty, IsUUID } from "class-validator";

export class GrDetailsDto {
    // @IsNotEmpty()
    // @IsUUID()
    // gr_master_id: string;

    @IsNotEmpty()
    prod_id: string;

    @IsNotEmpty()
    prod_qty: number;
}
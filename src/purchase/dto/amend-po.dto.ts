import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PoDetailsDto } from "./po-details.dto";

export class AmendPoDto {

    // @IsNotEmpty()
    // poNo: string;

    @IsDateString()
    poDate: Date;

    @IsNotEmpty()
    supId: string;

    @IsOptional()
    poRevReason: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PoDetailsDto)
    poDetails: PoDetailsDto[];


}
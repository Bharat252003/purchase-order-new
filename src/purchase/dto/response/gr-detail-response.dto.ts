import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GrnDetailResponseDto {
    // @Expose()
    // @ApiProperty({ example: 'a8740089-7c09-4a03-96ad-03b7f8104497' })
    id: string;

    @Expose()
    @ApiProperty({ example: 1 })
    sr_no: number;

    @Expose()
    @ApiProperty({ example: 'p-1' })
    prod_id: string;

    @Expose()
    @ApiProperty({ example: 50 })
    prod_qty: number;

    // Hidden field (not shown in response or Swagger)
    gr_master_id: string;
}

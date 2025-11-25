import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PoDetailResponseDto {

    // @Expose()
    // @ApiProperty({ example: '893c4647-d6c5-4a8a-bbe7-e7fbe70b5a8f' })
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

    // @Expose()
    @ApiProperty({ example: 0 })
    adj_qty: number;

    @Expose()
    @ApiProperty({ example: '100.00' })
    prod_rate: string;

    @Expose()
    @ApiProperty({ example: '5000.00' })
    total_amount: string;

    // @ApiProperty({ example: '9b690c7f-ee07-4ef7-8250-5fe79effe021' })
    po_master_id: string;
}

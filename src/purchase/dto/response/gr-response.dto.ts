import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GrnDetailResponseDto } from './gr-detail-response.dto';

export class GrnResponseDto {

    @Expose()
    @ApiProperty({ example: '092b779f-1254-4f52-8de3-5336b98a0599' })
    id: string;

    @Expose()
    @ApiProperty({ example: '2025-11-21' })
    grn_date: string;

    @Expose()
    @ApiProperty({ example: 'G-0001' })
    grn_no: string;

    @Expose()
    @ApiProperty({ example: 's-001' })
    sup_id: string;

    // Hidden: not shown in Swagger or response
    po_master_id: string;

    @Expose()
    @Type(() => GrnDetailResponseDto)
    @ApiProperty({
        type: [GrnDetailResponseDto]
    })
    gr_details: GrnDetailResponseDto[];

    @Expose()
    @ApiProperty({ example: '2025-11-25T05:35:41.974Z' })
    created_at: string;

    @Expose()
    @ApiProperty({ example: '2025-11-25T05:35:41.974Z' })
    updated_at: string;
}

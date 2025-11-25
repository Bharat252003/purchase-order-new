import { ApiProperty } from '@nestjs/swagger';
import { PoDetailResponseDto } from './po-detail-response.dto';
import { Expose, Type } from 'class-transformer';

export class PoResponseDto {
    @Expose()
    @ApiProperty({ example: '9b690c7f-ee07-4ef7-8250-5fe79effe021' })
    id: string;

    @Expose()
    @ApiProperty({ example: 'p-0001' })
    po_no: string;
        
    @Expose()
    @ApiProperty({ example: '2025-11-21' })
    po_date: string;
        
    @Expose()
    @ApiProperty({ example: 's-002' })
    sup_id: string;
        
    @Expose()
    @ApiProperty({ example: 0 })
    po_rev: number;
    
    @Expose()
    @ApiProperty({ example: '' })
    po_rev_reason: string;
    
    @Expose()
    @ApiProperty({ example: false })
    is_active: boolean;
    
    @Expose()
    @ApiProperty({ example: '55000.00' })
    po_amount: string;
    
    @Expose()
    @Type(() => PoDetailResponseDto)
    @ApiProperty({ type: [PoDetailResponseDto] })
    po_details: PoDetailResponseDto[];

    @Expose()
    @ApiProperty({ example: '2025-11-25T05:35:41.974Z' })
    created_at: string;

    @Expose()
    @ApiProperty({ example: '2025-11-25T05:35:41.974Z' })
    updated_at: string;
}

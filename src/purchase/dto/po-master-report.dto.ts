import { Expose, Type } from 'class-transformer';
import { PoDetailReportDto } from './po-detail-report.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AllPoReportDto {

  @ApiProperty({
    example: "9b690c7f-ee07-4ef7-8250-5fe79effe021"
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "P-0001"
  })
  @Expose()
  po_no: string;

  @ApiProperty({
    example: "2025-11-21"
  })
  @Expose()
  po_date: string;

  @ApiProperty({
    example: "s-002"
  })
  @Expose()
  sup_id: string;

  @ApiProperty({
    example: 0
  })
  @Expose()
  po_rev: number;

  @ApiProperty({
    example: ""
  })
  @Expose()
  po_rev_reason: string;

  @ApiProperty({
    example: true
  })
  @Expose()
  is_active: boolean;

  @ApiProperty({
    example: "55000.00"
  })
  @Expose()
  po_amount: string;

  @ApiProperty({
    type: () => [PoDetailReportDto],
    description: 'Purchase Order item details'
  })
  @Expose()
  @Type(() => PoDetailReportDto)
  po_details: PoDetailReportDto[];

  @ApiProperty({
    example: 100
  })
  @Expose()
  totalReceivedQty: number;

  @ApiProperty({
    example: 150
  })
  @Expose()
  totalOrderedQty: number;

  @ApiProperty({
    example: 0
  })
  @Expose()
  totalAdjustedQty: number;

  @ApiProperty({
    example: 50
  })
  @Expose()
  totalPendingQty: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PoDetailReportDto {

  @ApiProperty({
    example: 1,
    description: "Serial number of the product in the PO"
  })
  @Expose()
  sr_no: number;

  @ApiProperty({
    example: "p-1",
    description: "Product ID"
  })
  @Expose()
  prod_id: string;

  @ApiProperty({
    example: 150,
    description: "Ordered quantity"
  })
  @Expose()
  prod_qty: number;

  @ApiProperty({
    example: 100,
    description: 'Product Rate'
  })
  @Expose()
  prod_rate: number;

  @ApiProperty({
    example: 0,
    description: "Adjusted quantity (due to revision or shortage)"
  })
  @Expose()
  adj_qty: number;

  @ApiProperty({
    example: 100,
    description: "Total received quantity for this product"
  })
  @Expose()
  receivedQty: number;

  @ApiProperty({
    example: 50,
    description: "Pending quantity yet to be received"
  })
  @Expose()
  pendingQty: number;
}


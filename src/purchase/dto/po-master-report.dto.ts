import { Expose, Type } from 'class-transformer';
import { PoDetailReportDto } from './po-detail-report.dto';

export class AllPoReportDto {
  @Expose() id: string;

  @Expose() po_no: string;

  @Expose() po_date: string;

  @Expose() sup_id: string;

  @Expose() po_rev: number;

  @Expose() po_rev_reason: string;

  @Expose() is_active: boolean;

  @Expose() po_amount: string;

  @Expose()
  @Type(() => PoDetailReportDto)
  po_details: PoDetailReportDto[];

  @Expose() totalReceivedQty: number;

  @Expose() totalOrderedQty: number;

  @Expose() totalAdjustedQty: number;

  @Expose() totalPendingQty: number;
}

import { Expose } from 'class-transformer';

export class PoDetailReportDto {
  @Expose() sr_no: number;
  @Expose() prod_id: string;
  @Expose() prod_qty: number;
  @Expose() adj_qty: number;
  @Expose() receivedQty: number;
  @Expose() pendingQty: number;
}

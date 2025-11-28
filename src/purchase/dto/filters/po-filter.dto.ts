import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PoFilterDto {
  @ApiPropertyOptional({ example: 's-001' })
  @IsOptional()
  @IsString()
  sup_id?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({ example: '2025-11-01' })
  @IsOptional()
  from_date?: string;

  @ApiPropertyOptional({ example: '2025-11-30' })
  @IsOptional()
  to_date?: string;

  @ApiPropertyOptional({ example: 'P-0001' })
  @IsOptional()
  @IsString()
  po_no?: string;
}

import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoMaster } from './entities/po-master.entity';
import { PoDetail } from './entities/po-detail.entity';
import { GrMaster } from './entities/gr-master.entity';
import { GrDetail } from './entities/gr-detail.entity';
import { PoMasterMongo } from './entities/po-master.entity-mongo';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoMaster, PoDetail, GrMaster, GrDetail]),
    TypeOrmModule.forFeature(
      [PoMasterMongo],
      'mongodb',
    ),],
  providers: [PurchaseService],
  controllers: [PurchaseController]
})
export class PurchaseModule { }

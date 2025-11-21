import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePOTables1763632686113 implements MigrationInterface {
    name = 'CreatePOTables1763632686113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" DROP CONSTRAINT "FK_5eddc7e5a0221567221810a1a63"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" DROP CONSTRAINT "FK_db34e0f8f4e7abd277861547348"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" DROP COLUMN "poMasterId"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" DROP COLUMN "grMasterId"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" ADD CONSTRAINT "FK_469ffa49cdc05476b225a2869eb" FOREIGN KEY ("po_master_id") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" ADD CONSTRAINT "FK_d245ef9729b5754b7d07118bb32" FOREIGN KEY ("gr_master_id") REFERENCES "good_receipt_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" DROP CONSTRAINT "FK_d245ef9729b5754b7d07118bb32"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" DROP CONSTRAINT "FK_469ffa49cdc05476b225a2869eb"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" ADD "grMasterId" uuid`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" ADD "poMasterId" uuid`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" ADD CONSTRAINT "FK_db34e0f8f4e7abd277861547348" FOREIGN KEY ("grMasterId") REFERENCES "good_receipt_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" ADD CONSTRAINT "FK_5eddc7e5a0221567221810a1a63" FOREIGN KEY ("poMasterId") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

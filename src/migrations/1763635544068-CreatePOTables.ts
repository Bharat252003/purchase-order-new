import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePOTables1763635544068 implements MigrationInterface {
    name = 'CreatePOTables1763635544068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP CONSTRAINT "FK_0819ca3a066df644ffa1d3113a9"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP COLUMN "poMasterId"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD CONSTRAINT "FK_15ffe760df505fea639bd5e664d" FOREIGN KEY ("po_master_id") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP CONSTRAINT "FK_15ffe760df505fea639bd5e664d"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD "poMasterId" uuid`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD CONSTRAINT "FK_0819ca3a066df644ffa1d3113a9" FOREIGN KEY ("poMasterId") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

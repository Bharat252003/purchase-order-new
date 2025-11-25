import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePOTables1764048896534 implements MigrationInterface {
    name = 'CreatePOTables1764048896534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "purchase_order_master_new" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "purchase_order_master_new" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_order_master_new" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_master_new" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP COLUMN "created_at"`);
    }

}

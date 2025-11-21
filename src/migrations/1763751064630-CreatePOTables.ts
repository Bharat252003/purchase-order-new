import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePOTables1763751064630 implements MigrationInterface {
    name = 'CreatePOTables1763751064630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" ADD "adj_qty" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" DROP COLUMN "adj_qty"`);
    }

}

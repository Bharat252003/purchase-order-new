import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePOTables1763625760157 implements MigrationInterface {
    name = 'CreatePOTables1763625760157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase_order_detail_new" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sr_no" integer NOT NULL, "prod_id" character varying NOT NULL, "prod_qty" integer NOT NULL, "prod_rate" numeric(12,2) NOT NULL, "total_amount" numeric(12,2) NOT NULL, "po_master_id" uuid NOT NULL, "poMasterId" uuid, CONSTRAINT "PK_2b0cf691dd9660038dcb9d192e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "good_receipt_detail_new" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sr_no" integer NOT NULL, "prod_id" character varying NOT NULL, "prod_qty" integer NOT NULL, "gr_master_id" uuid NOT NULL, "grMasterId" uuid, CONSTRAINT "PK_84b0fd0d6c8909da689f2d8a3a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "good_receipt_master_new" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "grn_date" date NOT NULL, "grn_no" character varying NOT NULL, "sup_id" character varying NOT NULL, "po_master_id" uuid NOT NULL, "poMasterId" uuid, CONSTRAINT "PK_535e604ce1c03873b59b3152222" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_order_master_new" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "po_no" character varying NOT NULL, "po_date" date NOT NULL, "sup_id" character varying NOT NULL, "po_rev" integer NOT NULL DEFAULT '0', "po_rev_reason" character varying NOT NULL DEFAULT '', "is_active" boolean NOT NULL DEFAULT true, "po_amount" numeric(12,2), CONSTRAINT "PK_9127940357af5cfe67195824007" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" ADD CONSTRAINT "FK_5eddc7e5a0221567221810a1a63" FOREIGN KEY ("poMasterId") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" ADD CONSTRAINT "FK_db34e0f8f4e7abd277861547348" FOREIGN KEY ("grMasterId") REFERENCES "good_receipt_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" ADD CONSTRAINT "FK_0819ca3a066df644ffa1d3113a9" FOREIGN KEY ("poMasterId") REFERENCES "purchase_order_master_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "good_receipt_master_new" DROP CONSTRAINT "FK_0819ca3a066df644ffa1d3113a9"`);
        await queryRunner.query(`ALTER TABLE "good_receipt_detail_new" DROP CONSTRAINT "FK_db34e0f8f4e7abd277861547348"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_detail_new" DROP CONSTRAINT "FK_5eddc7e5a0221567221810a1a63"`);
        await queryRunner.query(`DROP TABLE "purchase_order_master_new"`);
        await queryRunner.query(`DROP TABLE "good_receipt_master_new"`);
        await queryRunner.query(`DROP TABLE "good_receipt_detail_new"`);
        await queryRunner.query(`DROP TABLE "purchase_order_detail_new"`);
    }

}

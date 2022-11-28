import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFarmTable1669655012893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "farm" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "name" character varying NOT NULL, 
          "address" character varying NOT NULL, 
          "coordinates" character varying NOT NULL, 
          "size" numeric NOT NULL, 
          "yield" numeric NOT NULL, 
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
          "ownerId" uuid NOT NULL, 
          CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" 
          PRIMARY KEY ("id")
        )`
    );

    await queryRunner.query(
      `ALTER TABLE "farm" 
        ADD CONSTRAINT "FK_d5f70ea0d7ab61a43bc2a7ce1a6" 
        FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_d5f70ea0d7ab61a43bc2a7ce1a6"`);
    await queryRunner.query(`DROP TABLE "farm"`);
  }

}

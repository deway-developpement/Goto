import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1685490096478 implements MigrationInterface {
    name = 'migrations1685490096478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`table\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ownerId\` varchar(36) NULL, UNIQUE INDEX \`IDX_2cb0b78846e0a65d35a4cd02d3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`table\` ADD CONSTRAINT \`FK_709d31ef6489352d3c366469099\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_709d31ef6489352d3c366469099\``);
        await queryRunner.query(`DROP INDEX \`IDX_2cb0b78846e0a65d35a4cd02d3\` ON \`table\``);
        await queryRunner.query(`DROP TABLE \`table\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1685541668875 implements MigrationInterface {
    name = 'migrations1685541668875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tables_hikes\` (\`tableId\` varchar(36) NOT NULL, \`hikeId\` varchar(36) NOT NULL, INDEX \`IDX_63cd54498279a223185325cf79\` (\`tableId\`), INDEX \`IDX_7066020e881d3ef9440d0ad0fc\` (\`hikeId\`), PRIMARY KEY (\`tableId\`, \`hikeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tables_hikes\` ADD CONSTRAINT \`FK_63cd54498279a223185325cf79e\` FOREIGN KEY (\`tableId\`) REFERENCES \`table\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tables_hikes\` ADD CONSTRAINT \`FK_7066020e881d3ef9440d0ad0fc9\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tables_hikes\` DROP FOREIGN KEY \`FK_7066020e881d3ef9440d0ad0fc9\``);
        await queryRunner.query(`ALTER TABLE \`tables_hikes\` DROP FOREIGN KEY \`FK_63cd54498279a223185325cf79e\``);
        await queryRunner.query(`DROP INDEX \`IDX_7066020e881d3ef9440d0ad0fc\` ON \`tables_hikes\``);
        await queryRunner.query(`DROP INDEX \`IDX_63cd54498279a223185325cf79\` ON \`tables_hikes\``);
        await queryRunner.query(`DROP TABLE \`tables_hikes\``);
    }

}

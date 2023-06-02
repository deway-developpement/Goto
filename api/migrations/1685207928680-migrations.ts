import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1685207928680 implements MigrationInterface {
    name = 'migrations1685207928680';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`performance\` DROP COLUMN \`duration\``);
        await queryRunner.query(
            `ALTER TABLE \`performance\` ADD \`duration\` decimal(5,2) NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`performance\` DROP COLUMN \`distance\``);
        await queryRunner.query(
            `ALTER TABLE \`performance\` ADD \`distance\` decimal(5,1) NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`hike\` DROP COLUMN \`distance\``);
        await queryRunner.query(`ALTER TABLE \`hike\` ADD \`distance\` decimal(5,1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hike\` DROP COLUMN \`duration\``);
        await queryRunner.query(`ALTER TABLE \`hike\` ADD \`duration\` decimal(5,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` DROP FOREIGN KEY \`FK_d672d66d46ea66f10305eed41c0\``
        );
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` DROP FOREIGN KEY \`FK_88de0d180ae18ec599a44d8dcbe\``
        );
        await queryRunner.query(`ALTER TABLE \`hike\` DROP COLUMN \`duration\``);
        await queryRunner.query(`ALTER TABLE \`hike\` ADD \`duration\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hike\` DROP COLUMN \`distance\``);
        await queryRunner.query(`ALTER TABLE \`hike\` ADD \`distance\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`performance\` DROP COLUMN \`distance\``);
        await queryRunner.query(`ALTER TABLE \`performance\` ADD \`distance\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`performance\` DROP COLUMN \`duration\``);
        await queryRunner.query(`ALTER TABLE \`performance\` ADD \`duration\` int NOT NULL`);
    }
}

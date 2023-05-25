import { MigrationInterface, QueryRunner } from "typeorm";

export class TextToPOI1685029635738 implements MigrationInterface {
    name = 'TextToPOI1685029635738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pointOfInterest\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`pointOfInterest\` ADD \`description\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pointOfInterest\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`pointOfInterest\` ADD \`description\` varchar(1500) NOT NULL`);
    }

}

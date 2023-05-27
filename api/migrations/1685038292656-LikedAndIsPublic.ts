import { MigrationInterface, QueryRunner } from 'typeorm';

export class LikedAndIsPublic1685038292656 implements MigrationInterface {
    name = 'LikedAndIsPublic1685038292656';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`users_likes\` (\`userId\` varchar(36) NOT NULL, \`hikeId\` varchar(36) NOT NULL, INDEX \`IDX_88de0d180ae18ec599a44d8dcb\` (\`userId\`), INDEX \`IDX_d672d66d46ea66f10305eed41c\` (\`hikeId\`), PRIMARY KEY (\`userId\`, \`hikeId\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`public\` tinyint null`);
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` ADD CONSTRAINT \`FK_88de0d180ae18ec599a44d8dcbe\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` ADD CONSTRAINT \`FK_d672d66d46ea66f10305eed41c0\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` DROP FOREIGN KEY \`FK_d672d66d46ea66f10305eed41c0\``
        );
        await queryRunner.query(
            `ALTER TABLE \`users_likes\` DROP FOREIGN KEY \`FK_88de0d180ae18ec599a44d8dcbe\``
        );
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`public\``);
        await queryRunner.query(`DROP INDEX \`IDX_d672d66d46ea66f10305eed41c\` ON \`users_likes\``);
        await queryRunner.query(`DROP INDEX \`IDX_88de0d180ae18ec599a44d8dcb\` ON \`users_likes\``);
        await queryRunner.query(`DROP TABLE \`users_likes\``);
    }
}

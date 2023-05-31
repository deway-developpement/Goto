import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1685029379730 implements MigrationInterface {
    name = 'Init1685029379730';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`pointOfInterest\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(1500) NOT NULL, \`latitude\` int NOT NULL, \`longitude\` int NOT NULL, \`url\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_dc0d625ac8c50e7f4b124ae345\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`review\` (\`id\` varchar(36) NOT NULL, \`rating\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, \`hikeId\` varchar(36) NULL, UNIQUE INDEX \`IDX_13c255c92d1c8c3b3fb445f0ff\` (\`userId\`, \`hikeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`alert\` (\`id\` varchar(36) NOT NULL, \`latitude\` int NOT NULL, \`longitude\` int NOT NULL, \`type\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`hikeId\` varchar(36) NULL, \`authorId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`performance\` (\`id\` varchar(36) NOT NULL, \`date\` datetime NOT NULL, \`duration\` int NOT NULL, \`distance\` int NOT NULL, \`elevation\` int NOT NULL, \`track\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, \`hikeId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`hike\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`distance\` int NOT NULL, \`elevation\` int NOT NULL, \`description\` varchar(255) NOT NULL, \`difficulty\` enum ('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy', \`duration\` int NOT NULL, \`track\` varchar(255) NOT NULL, \`latitude\` decimal(16,5) NOT NULL, \`longitude\` decimal(16,5) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ownerId\` varchar(36) NULL, \`categoryId\` varchar(36) NULL, UNIQUE INDEX \`IDX_2ffc109434f0025077f97bc2a3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`photo\` (\`id\` varchar(36) NOT NULL, \`filename\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`hikeId\` varchar(36) NULL, \`userId\` varchar(36) NULL, \`categoryId\` varchar(36) NULL, \`pointOfInterestId\` varchar(36) NULL, UNIQUE INDEX \`IDX_391cb98c1b40d39b6b7d9bfdf0\` (\`filename\`), UNIQUE INDEX \`REL_4494006ff358f754d07df5ccc8\` (\`userId\`), UNIQUE INDEX \`REL_d42eafa798fb60f8610f6287c1\` (\`categoryId\`), UNIQUE INDEX \`REL_5dcf9239146f1bccffb69ed3f1\` (\`pointOfInterestId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`pseudo\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`publicKey\` varchar(255) NOT NULL, \`credidential\` int NOT NULL, \`refresh_token\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_9bcc89750ac2ac9fa6aca3f4b7\` (\`pseudo\`, \`publicKey\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`hikes_tags\` (\`tagId\` varchar(36) NOT NULL, \`hikeId\` varchar(36) NOT NULL, INDEX \`IDX_0d6342fcaddcbb61265728195d\` (\`tagId\`), INDEX \`IDX_a26eee5537f905b3d73050167f\` (\`hikeId\`), PRIMARY KEY (\`tagId\`, \`hikeId\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`hikes_pointsOfInterest\` (\`pointOfInterestId\` varchar(36) NOT NULL, \`hikeId\` varchar(36) NOT NULL, INDEX \`IDX_dc984e0d9c0389dcb586433485\` (\`pointOfInterestId\`), INDEX \`IDX_e0eaff395d1eedcddc46c0101f\` (\`hikeId\`), PRIMARY KEY (\`pointOfInterestId\`, \`hikeId\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`users_friends\` (\`userId_1\` varchar(36) NOT NULL, \`userId_2\` varchar(36) NOT NULL, INDEX \`IDX_a0f1f1bed81af8a23e083298da\` (\`userId_1\`), INDEX \`IDX_49f84b2dc1d9c1869635e9bbd8\` (\`userId_2\`), PRIMARY KEY (\`userId_1\`, \`userId_2\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_a910f66b3ba2ee501f68d51f1d7\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`alert\` ADD CONSTRAINT \`FK_64d8dec5d9d6c181ed058ca16d8\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`alert\` ADD CONSTRAINT \`FK_a6c2dfbb73f3387ed33177130ea\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`performance\` ADD CONSTRAINT \`FK_291678de3e168e70109fd03b526\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`performance\` ADD CONSTRAINT \`FK_afd705978bd4e8d4586df101c24\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`hike\` ADD CONSTRAINT \`FK_350804420e5b744bf1ad2797e92\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`hike\` ADD CONSTRAINT \`FK_cc19698c4168f985f5ce9e294b6\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_42cb1757dd2c461d856c06370bb\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_4494006ff358f754d07df5ccc87\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_d42eafa798fb60f8610f6287c1e\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_5dcf9239146f1bccffb69ed3f13\` FOREIGN KEY (\`pointOfInterestId\`) REFERENCES \`pointOfInterest\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_tags\` ADD CONSTRAINT \`FK_0d6342fcaddcbb61265728195d8\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_tags\` ADD CONSTRAINT \`FK_a26eee5537f905b3d73050167fd\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_pointsOfInterest\` ADD CONSTRAINT \`FK_dc984e0d9c0389dcb586433485d\` FOREIGN KEY (\`pointOfInterestId\`) REFERENCES \`pointOfInterest\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_pointsOfInterest\` ADD CONSTRAINT \`FK_e0eaff395d1eedcddc46c0101fa\` FOREIGN KEY (\`hikeId\`) REFERENCES \`hike\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`users_friends\` ADD CONSTRAINT \`FK_a0f1f1bed81af8a23e083298da1\` FOREIGN KEY (\`userId_1\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE \`users_friends\` ADD CONSTRAINT \`FK_49f84b2dc1d9c1869635e9bbd80\` FOREIGN KEY (\`userId_2\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users_friends\` DROP FOREIGN KEY \`FK_49f84b2dc1d9c1869635e9bbd80\``
        );
        await queryRunner.query(
            `ALTER TABLE \`users_friends\` DROP FOREIGN KEY \`FK_a0f1f1bed81af8a23e083298da1\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_pointsOfInterest\` DROP FOREIGN KEY \`FK_e0eaff395d1eedcddc46c0101fa\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_pointsOfInterest\` DROP FOREIGN KEY \`FK_dc984e0d9c0389dcb586433485d\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_tags\` DROP FOREIGN KEY \`FK_a26eee5537f905b3d73050167fd\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hikes_tags\` DROP FOREIGN KEY \`FK_0d6342fcaddcbb61265728195d8\``
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_5dcf9239146f1bccffb69ed3f13\``
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_d42eafa798fb60f8610f6287c1e\``
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_4494006ff358f754d07df5ccc87\``
        );
        await queryRunner.query(
            `ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_42cb1757dd2c461d856c06370bb\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hike\` DROP FOREIGN KEY \`FK_cc19698c4168f985f5ce9e294b6\``
        );
        await queryRunner.query(
            `ALTER TABLE \`hike\` DROP FOREIGN KEY \`FK_350804420e5b744bf1ad2797e92\``
        );
        await queryRunner.query(
            `ALTER TABLE \`performance\` DROP FOREIGN KEY \`FK_afd705978bd4e8d4586df101c24\``
        );
        await queryRunner.query(
            `ALTER TABLE \`performance\` DROP FOREIGN KEY \`FK_291678de3e168e70109fd03b526\``
        );
        await queryRunner.query(
            `ALTER TABLE \`alert\` DROP FOREIGN KEY \`FK_a6c2dfbb73f3387ed33177130ea\``
        );
        await queryRunner.query(
            `ALTER TABLE \`alert\` DROP FOREIGN KEY \`FK_64d8dec5d9d6c181ed058ca16d8\``
        );
        await queryRunner.query(
            `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_a910f66b3ba2ee501f68d51f1d7\``
        );
        await queryRunner.query(
            `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_49f84b2dc1d9c1869635e9bbd8\` ON \`users_friends\``
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_a0f1f1bed81af8a23e083298da\` ON \`users_friends\``
        );
        await queryRunner.query(`DROP TABLE \`users_friends\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_e0eaff395d1eedcddc46c0101f\` ON \`hikes_pointsOfInterest\``
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_dc984e0d9c0389dcb586433485\` ON \`hikes_pointsOfInterest\``
        );
        await queryRunner.query(`DROP TABLE \`hikes_pointsOfInterest\``);
        await queryRunner.query(`DROP INDEX \`IDX_a26eee5537f905b3d73050167f\` ON \`hikes_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d6342fcaddcbb61265728195d\` ON \`hikes_tags\``);
        await queryRunner.query(`DROP TABLE \`hikes_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_9bcc89750ac2ac9fa6aca3f4b7\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_5dcf9239146f1bccffb69ed3f1\` ON \`photo\``);
        await queryRunner.query(`DROP INDEX \`REL_d42eafa798fb60f8610f6287c1\` ON \`photo\``);
        await queryRunner.query(`DROP INDEX \`REL_4494006ff358f754d07df5ccc8\` ON \`photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_391cb98c1b40d39b6b7d9bfdf0\` ON \`photo\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ffc109434f0025077f97bc2a3\` ON \`hike\``);
        await queryRunner.query(`DROP TABLE \`hike\``);
        await queryRunner.query(`DROP TABLE \`performance\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`alert\``);
        await queryRunner.query(`DROP INDEX \`IDX_13c255c92d1c8c3b3fb445f0ff\` ON \`review\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_dc0d625ac8c50e7f4b124ae345\` ON \`pointOfInterest\``
        );
        await queryRunner.query(`DROP TABLE \`pointOfInterest\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }
}

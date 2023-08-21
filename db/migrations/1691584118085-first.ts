import { MigrationInterface, QueryRunner } from "typeorm";

export class First1691584118085 implements MigrationInterface {
    name = 'First1691584118085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artist_id" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artist_id" uuid, "album_id" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "track_id" uuid NOT NULL, CONSTRAINT "REL_23ba6f9c49589a631f5adb662e" UNIQUE ("track_id"), CONSTRAINT "PK_8d34ad5c55c7d5448fad8c4ced7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "artist_id" uuid NOT NULL, CONSTRAINT "REL_177889f5d1b6f1280a54ba9226" UNIQUE ("artist_id"), CONSTRAINT "PK_a2808c56d3dc5d8882f9495e63d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "album_id" uuid NOT NULL, CONSTRAINT "REL_42e02a136b78c65e0b89b7c8d9" UNIQUE ("album_id"), CONSTRAINT "PK_8435921763b8a56c98b3700773d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_fceb1d9483fda6a312af244a80e" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_tracks" ADD CONSTRAINT "FK_23ba6f9c49589a631f5adb662e5" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" ADD CONSTRAINT "FK_177889f5d1b6f1280a54ba9226b" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_albums" ADD CONSTRAINT "FK_42e02a136b78c65e0b89b7c8d96" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_albums" DROP CONSTRAINT "FK_42e02a136b78c65e0b89b7c8d96"`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" DROP CONSTRAINT "FK_177889f5d1b6f1280a54ba9226b"`);
        await queryRunner.query(`ALTER TABLE "favorite_tracks" DROP CONSTRAINT "FK_23ba6f9c49589a631f5adb662e5"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_fceb1d9483fda6a312af244a80e"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_495f8b68c75ac5c9b0301a85b32"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "favorite_albums"`);
        await queryRunner.query(`DROP TABLE "favorite_artists"`);
        await queryRunner.query(`DROP TABLE "favorite_tracks"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "artists"`);
    }

}

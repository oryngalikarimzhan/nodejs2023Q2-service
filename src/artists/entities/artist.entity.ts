import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column()
  @IsString()
  @Length(2)
  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @Column()
  @IsBoolean()
  @ApiProperty({ example: false })
  grammy: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column()
  @IsString()
  @Length(2)
  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @Column()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @ApiProperty({ example: 2020 })
  year: number;

  @Column({ nullable: true })
  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid' })
  artistId: string | null;
}

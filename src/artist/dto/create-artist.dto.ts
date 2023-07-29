import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @Length(2)
  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  grammy: boolean;
}

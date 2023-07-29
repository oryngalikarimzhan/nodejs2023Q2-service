import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsString, Length } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsString()
  @Length(2)
  @ApiProperty({
    example: 'James Bond',
    required: false,
    format: 'optional',
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    format: 'optional',
  })
  grammy: boolean;
}

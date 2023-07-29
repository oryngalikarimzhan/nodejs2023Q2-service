import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3)
  @IsString()
  @ApiProperty({ example: 'admin' })
  login: string;

  @IsString()
  @Length(5)
  @ApiProperty({ example: 'password' })
  password: string;
}

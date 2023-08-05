import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword' })
  newPassword: string;
}

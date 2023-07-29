import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'password' })
  oldPassword: string;
  @ApiProperty({ example: 'newPassword' })
  newPassword: string;
}

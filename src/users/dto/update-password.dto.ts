import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'password' })
  oldPassword: string;
  @ApiProperty({ example: 'newPassword' })
  newPassword: string;
}

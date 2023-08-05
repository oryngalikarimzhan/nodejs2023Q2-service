import { ApiProperty, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends PickType(User, ['login'] as const) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;
}

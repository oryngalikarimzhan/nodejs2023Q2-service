import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  users: Record<string, User> = {};

  findAll() {
    return Object.keys(this.users).map((userId) => this.users[userId]);
  }

  findOne(userId: string) {
    const user = this.users[userId];

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  create({ login, password }: CreateUserDto) {
    const hasUser = !!Object.keys(this.users).find(
      (userId) => this.users[userId].login === login,
    );

    if (hasUser) {
      throw new ForbiddenException(null, 'User with this login already exists');
    }

    const user = new User(login, password);
    this.users[user.id] = user;

    return user;
  }

  update(userId: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    const user = this.findOne(userId);

    if (user.password !== oldPassword) {
      throw new ForbiddenException(null, 'old password is wrong');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        null,
        'old password and new password can not be the same',
      );
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    user.version += 1;

    return user;
  }

  remove(userId: string) {
    const user = this.findOne(userId);

    delete this.users[user.id];

    return;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  users: Record<string, User> = {};

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userDto = this.usersRepository.create(createUserDto);

      return await this.usersRepository.save(userDto);
    } catch (e) {
      if (e.code && e.code === '23505') {
        throw new ForbiddenException('User with this login already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const hasProperties = Object.keys(updatePasswordDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException('Body is empty');
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    const user = await this.findOne(userId);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('old password is wrong');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'old password and new password can not be the same',
      );
    }

    user.password = newPassword;

    return this.usersRepository.save(user);
  }

  async remove(userId: string) {
    const result = await this.usersRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}

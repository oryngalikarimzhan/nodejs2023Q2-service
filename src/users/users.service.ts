import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    this.checkLoginExistence(createUserDto.login);

    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  async update(
    id: string,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ) {
    const user = await this.findOne(id);

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

  async remove(id: string) {
    const { affected } = await this.usersRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }

  async checkLoginExistence(login: string) {
    const user = await this.usersRepository.findOneBy({ login });

    if (user) {
      throw new ForbiddenException('User with this login already exists');
    }
  }
}

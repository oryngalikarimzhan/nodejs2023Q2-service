import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneByLogin(login: string) {
    return await this.usersRepository.findOneBy({ login });
  }

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    await this.checkLoginExistence(login);

    const hashedPassword = await hash(
      password,
      +this.configService.get('CRYPT_SALT'),
    );

    const user = this.usersRepository.create({
      login,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async update(
    id: string,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ) {
    const user = await this.findOneById(id);

    if (!(await compare(oldPassword, user.password))) {
      throw new ForbiddenException('old password is wrong');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'old password and new password can not be the same',
      );
    }

    user.password = await hash(
      newPassword,
      +this.configService.get('CRYPT_SALT'),
    );

    return this.usersRepository.save(user);
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    user.refreshToken = refreshToken;
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { CreateUserFromOauthDto } from './dto/create.userFromOauth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async getUserByName(name: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ name });
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOne(id);
  }

  async getUserByThirdPartyId(thirdPartyId: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ thirdPartyId });
  }

  async createUserFromOAuth(profile, provider): Promise<UserEntity> {
    const userData: CreateUserFromOauthDto = {
      name: `${profile.name.givenName}.${profile.name.familyName}.${provider}`,
      thirdPartyId: profile.id,
    };
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { CreateGoogleUserDto } from './dto/create.googleUser.dto';

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

  async createUserFromGoogle(profile): Promise<UserEntity> {
    const userData: CreateGoogleUserDto = {
      name: `${profile.name.givenName}.${profile.name.familyName}`,
      thirdPartyId: profile.id,
    };
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async createUserFromOAuth(profile, provider): Promise<UserEntity> {
    if (provider === 'google') {
      return await this.createUserFromGoogle(profile);
    }
    return null;
  }
}

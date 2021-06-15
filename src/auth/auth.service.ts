import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { UserEntity } from '../users/user.entity';

export enum Provider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  VKONTAKTE = 'vkontakte',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string): Promise<UserEntity> {
    const user = await this.usersService.getUserByName(name);
    if (!user) {
      throw new UnauthorizedException();
    }

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      throw new UnauthorizedException();
    }

    return user;
  }

  public async login(user) {
    const token: string = await this.getJwtToken(user.id);
    return { token };
  }

  async register(user: CreateUserDto): Promise<boolean> {
    const pass = await this.hashPassword(user.password);

    let newUser;
    try {
      newUser = await this.usersService.createUser({ ...user, password: pass });
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
    return Boolean(newUser);
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 8);
    return hash;
  }

  async getJwtToken(userId: number): Promise<string> {
    const token = await this.jwtService.signAsync({ userId });
    return token;
  }

  async validateOAuthLogin(profile, provider) {
    let user = await this.usersService.getUserByThirdPartyId(profile.id);
    if (!user) {
      user = await this.usersService.createUserFromOAuth(profile, provider);
    }
    const token = await this.getJwtToken(user.id);
    return { token };
  }
}

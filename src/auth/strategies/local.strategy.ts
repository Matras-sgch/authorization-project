import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const validUser = await this.authService.validateUser(email, password);
    if (!validUser) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return validUser;
  }
}

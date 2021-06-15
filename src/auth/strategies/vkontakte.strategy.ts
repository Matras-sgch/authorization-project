import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, Params } from 'passport-vkontakte';
import { AuthService, Provider } from '../auth.service';

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.VKONTAKTE_APP_ID,
      clientSecret: process.env.VKONTAKTE_APP_SECRET,
      callbackURL: `${process.env.DOMAIN}/auth/vkontakte/redirect`,
      scope: ['email'],
      profileFields: ['name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    params: Params,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    return this.authService.validateOAuthLogin(
      { name: { givenName: params.username, familyName: ' ' }, id: params.id },
      Provider.VKONTAKTE,
    );
  }
}

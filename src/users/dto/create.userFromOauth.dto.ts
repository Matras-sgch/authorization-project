import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserFromOauthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  thirdPartyId: string;
}

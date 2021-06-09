import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGoogleUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  thirdPartyId: string;
}

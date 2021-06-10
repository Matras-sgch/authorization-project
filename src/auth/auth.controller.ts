import {
  Body,
  Controller,
  HttpCode,
  Post,
  Response,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { LoginUserDto } from './dto/login.user.dto';
import GoogleAuthGuard from './guards/googleAuth.guard';
import FacebookAuthGuard from "./guards/facebookAuth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/register')
  async register(@Body() regData: CreateUserDto, @Response() res) {
    await this.authService.register(regData);
    res.end();
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  @ApiUnauthorizedResponse()
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req): Promise<{ token: string }> {
    const { user } = req;
    return await this.authService.login(user);
  }

  @Get('/facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  facebookLoginCallback(@Request() req) {
    const token = req.user.token;
    return { token };
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Request() req) {
    const token = req.user.token;
    return { token };
  }
}

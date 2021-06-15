import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getMockUsers } from '../users/mock/mockUsers';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const mockUsers = getMockUsers();
  const findUser: jest.Mock = jest.fn().mockResolvedValue(mockUsers[0]);
  const saveUser: jest.Mock = jest.fn().mockResolvedValue(mockUsers[0]);

  const UsersRepository = {
    findOne: findUser,
    save: saveUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          useValue: UsersRepository,
          provide: getRepositoryToken(UserEntity),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', () => {
    service.login = jest.fn().mockResolvedValue('token');
    expect(controller.login(mockUsers[0])).not.toBeNull();
  });

  it('should login with facebook', () => {
    expect(
      controller.facebookLoginCallback({ user: { token: 'token' } }),
    ).not.toBeNull();
  });

  it('should login with instagram', () => {
    expect(
      controller.instagramLoginCallback({ user: { token: 'token' } }),
    ).not.toBeNull();
  });

  it('should login with google', () => {
    expect(
      controller.googleLoginCallback({ user: { token: 'token' } }),
    ).not.toBeNull();
  });

  it('should login with vkontakte', () => {
    expect(
      controller.vkontakteLoginCallback({ user: { token: 'token' } }),
    ).not.toBeNull();
  });
});

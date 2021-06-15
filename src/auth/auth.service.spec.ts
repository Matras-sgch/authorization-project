import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getMockUsers } from '../users/mock/mockUsers';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const mockUsers = getMockUsers();
  const findUser: jest.Mock = jest.fn().mockResolvedValue(mockUsers[0]);
  const saveUser: jest.Mock = jest.fn().mockResolvedValue(mockUsers[0]);

  const UsersRepository = {
    findOne: findUser,
    save: saveUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          useValue: UsersRepository,
          provide: getRepositoryToken(UserEntity),
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
    service = module.get<AuthService>(AuthService);
  });

  it('should validate user', async () => {
    userService.getUserByName = jest.fn().mockResolvedValue(mockUsers[0]);
    service.comparePassword = jest.fn().mockResolvedValue(true);
    expect(
      await service.validateUser(mockUsers[0].name, mockUsers[0].password),
    ).toBe(mockUsers[0]);
  });

  it('should compare password', async () => {
    expect(
      await service.comparePassword(
        'asddaaaaa',
        '$2a$08$FmJG.inuMJa0Ui/59UO.2uEKGwAb2CZU/RU2L/Ody3134M6jMfZSC',
      ),
    ).not.toBeNull();
  });

  it('should hash password', async () => {
    expect(await service.hashPassword('asddaaaaa')).not.toBe('asddaaaaa');
  });

  it('should create token', async () => {
    jwtService.signAsync = jest.fn().mockResolvedValue('token');
    expect(await service.getJwtToken(mockUsers[0].id)).not.toBeNull();
  });

  it('should validate oauth login', async () => {
    userService.getUserByThirdPartyId = jest
      .fn()
      .mockResolvedValue(mockUsers[0]);
    userService.createUserFromOAuth = jest.fn().mockResolvedValue(mockUsers[0]);
    service.getJwtToken = jest.fn().mockResolvedValue('token');
    expect(
      await service.validateOAuthLogin(mockUsers[0], 'google'),
    ).not.toBeNull();
  });

  it('should validate oauth login', async () => {
    userService.getUserByThirdPartyId = jest.fn().mockResolvedValue(null);
    userService.createUserFromOAuth = jest.fn().mockResolvedValue(mockUsers[0]);
    service.getJwtToken = jest.fn().mockResolvedValue('token');
    expect(
      await service.validateOAuthLogin(mockUsers[0], 'google'),
    ).not.toBeNull();
  });

  it('should not validate user', async () => {
    userService.getUserByName = jest.fn().mockResolvedValue(undefined);
    service.comparePassword = jest.fn().mockResolvedValue(false);
    expect(async () => {
      await service.validateUser(mockUsers[0].name, mockUsers[0].password);
    }).rejects.toEqual(new UnauthorizedException());
  });

  it('should not validate user', async () => {
    userService.getUserByName = jest.fn().mockResolvedValue(mockUsers[0]);
    service.comparePassword = jest.fn().mockResolvedValue(false);
    expect(async () => {
      await service.validateUser(mockUsers[0].name, mockUsers[0].password);
    }).rejects.toEqual(new UnauthorizedException());
  });

  it('should return token', async () => {
    service.getJwtToken = jest.fn().mockResolvedValue('token');
    const token = await service.login(mockUsers[0]);
    expect(token).not.toBeNull();
  });

  it('should register user', async () => {
    service.hashPassword = jest.fn().mockResolvedValue(mockUsers[0].password);
    userService.createUser = jest.fn().mockResolvedValue(mockUsers[0]);
    const user = await service.register(mockUsers[0]);
    expect(user).toBe(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not register user', async () => {
    service.hashPassword = jest.fn().mockResolvedValue(mockUsers[0].password);
    userService.createUser = jest.fn().mockResolvedValue(new Error());
    expect(async () => {
      await service.register(mockUsers[0]);
    }).rejects.toEqual(new BadRequestException());
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getMockUsers } from './mock/mockUsers';

describe('UsersService', () => {
  let userService: UsersService;
  const mockUsers = getMockUsers();

  beforeEach(async () => {
    const UsersRepository = {
      findOne: jest.fn().mockResolvedValue(mockUsers[0]),
      save: jest.fn().mockResolvedValue(mockUsers[0]),
      create: jest.fn().mockResolvedValue(mockUsers[0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          useValue: UsersRepository,
          provide: getRepositoryToken(UserEntity),
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create user', async () => {
    expect(
      await userService.createUser({
        name: mockUsers[0].name,
        password: mockUsers[0].password,
      }),
    ).toBe(mockUsers[0]);
  });

  it('should find user by name', async () => {
    expect(await userService.getUserByName(mockUsers[0].name)).toBe(
      mockUsers[0],
    );
  });

  it('should find user by id', async () => {
    expect(await userService.getUserById(mockUsers[0].id)).toBe(mockUsers[0]);
  });

  it('should create user from oauth', async () => {
    expect(
      await userService.createUserFromOAuth(
        {
          thirdPartyId: mockUsers[0].thirdPartyId,
          name: {
            givenName: 'example',
            familyName: 'example',
          },
        },
        'google',
      ),
    ).toBe(mockUsers[0]);
  });
});

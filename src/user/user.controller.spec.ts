import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = { id: '1', name: 'John Doe', email: 'johndoe@test.com' };
  const mockUsers = [{ id: '1', name: 'John Doe', email: 'johndoe@test.com' }, { id: '1', name: 'Joana Doe', email: 'joanadoe@test.com' }];

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === '1') {
        return Promise.resolve(mockUser);
      }
      throw new NotFoundException(`The user ${id} does not exist.`);
    }),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'johndoe@test.com', password:"password123" };
      expect(await controller.create(createUserDto)).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Doe', email: 'johndoe@test.com' };
      expect(await controller.update('1', updateUserDto)).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('The user 2 does not exist.'));
      const updateUserDto: UpdateUserDto = { name: 'John Doe', email: 'johndoe@test.com' };
      await expect(controller.update('2', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      expect(await controller.remove('1')).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('The user 2 does not exist.'));
      await expect(controller.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
});

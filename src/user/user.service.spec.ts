import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const result: User = {
        id: '1',
        ...createUserDto,
        password: hashedPassword,
      } as User;

      jest.spyOn(model, 'create').mockResolvedValue(result as any);

      const response: User = await service.create(createUserDto);
      
      expect(response).toEqual({ id: result.id, name: result.name, email: result.email, password: result.password });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' } as User,
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', password: 'password' } as User,
      ];

      jest.spyOn(model, 'find').mockResolvedValue(users as any);

      const response: User[] = await service.findAll();

      expect(response).toEqual(users.map(user => ({ id: user.id, name: user.name, email: user.email, password: user.password })));
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' } as User;

      jest.spyOn(model, 'findById').mockResolvedValue(user as any);

      const response: User = await service.findOne('1');
      
      expect(response).toEqual({ id: user.id, name: user.name, email: user.email, password: user.password });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('The user 1 does not exist.');
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'John Updated' };
      const user: User = { id: '1', name: 'John Updated', email: 'john@example.com', password: 'password' } as User;

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(user as any);

      const response: User = await service.update('1', updateUserDto);

      expect(response).toEqual({ id: user.id, name: user.name, email: user.email, password: user.password });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(service.update('1', {} as UpdateUserDto)).rejects.toThrow('The user 1 does not exist.');
    });
  });

  describe('remove', () => {
    it('should remove and return the user', async () => {
      const user: User = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' } as User;

      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(user as any);

      const response: User = await service.remove('1');

      expect(response).toEqual({ id: user.id, name: user.name, email: user.email, password: user.password });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow('The user 1 does not exist.');
    });
  });
});

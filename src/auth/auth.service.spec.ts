// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import { Model } from 'mongoose';
// import { BlacklistedToken } from './schemas/token.schema';
// import * as bcrypt from 'bcrypt';
// import { BadRequestException, UnauthorizedException } from '@nestjs/common';
// import { ChangePasswordDto } from './dto/change-password.dto';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let userService: UserService;
//   let jwtService: JwtService;
//   let blacklistedTokenModel: Model<BlacklistedToken>;

//   const mockUserService = {
//     findByEmail: jest.fn(),
//     findOne: jest.fn(),
//     create: jest.fn(),
//     update: jest.fn(),
//   };

//   const mockJwtService = {
//     sign: jest.fn(),
//     decode: jest.fn(),
//     verify: jest.fn(),
//   };

//   const mockBlacklistedTokenModel = {
//     create: jest.fn().mockResolvedValue({}),
//     findOne: jest.fn().mockResolvedValue(null),
//     save: jest.fn().mockResolvedValue({}),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: JwtService,
//           useValue: mockJwtService,
//         },
//         {
//           provide: 'BlacklistedTokenModel',
//           useValue: mockBlacklistedTokenModel,
//         },
//         {
//           provide: UserService,
//           useValue: mockUserService,
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     userService = module.get<UserService>(UserService);
//     jwtService = module.get<JwtService>(JwtService);
//     blacklistedTokenModel = module.get<Model<BlacklistedToken>>('BlacklistedTokenModel');
//   });

//   it('should be defined', () => {
//     expect(authService).toBeDefined();
//   });

//   describe('loginUser', () => {
//     it('should return a token and userResponse on successful login', async () => {
//       const email = 'test@example.com';
//       const password = 'password';
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const user = { id: '1', name: 'John Doe', email, password: hashedPassword };
//       mockUserService.findByEmail.mockResolvedValue(user);
//       mockJwtService.sign.mockReturnValue('token');

//       const result = await authService.loginUser(email, password);
//       expect(result).toEqual({
//         token: 'token',
//         userResponse: { id: user.id, name: user.name, email: user.email },
//       });
//     });

//     it('should throw UnauthorizedException for invalid credentials', async () => {
//       mockUserService.findByEmail.mockResolvedValue(null);
//       await expect(authService.loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('logout', () => {
//     it('should blacklist a token', async () => {
//       const token = 'token';
//       const expiresAt = new Date();
//       mockJwtService.decode.mockReturnValue({ exp: expiresAt.getTime() / 1000 });

//       await authService.logout(token, 1);

//       expect(mockBlacklistedTokenModel.create).toHaveBeenCalledWith({ token, expiresAt });
//     });
//   });

//   describe('registerUser', () => {
//     it('should register a user and return a token and userResponse', async () => {
//       const createUserDto = { name: 'John Doe', email: 'test@example.com', password: 'password' };
//       const user = { id: '1', name: 'John Doe', email: 'test@example.com', password: 'hashedpassword' };
//       mockUserService.create.mockResolvedValue(user);
//       mockJwtService.sign.mockReturnValue('token');

//       const result = await authService.registerUser(createUserDto);

//       expect(result).toEqual({
//         token: 'token',
//         userResponse: { id: user.id, name: user.name, email: user.email },
//       });
//     });
//   });

//   describe('changePassword', () => {
//     it('should update the password successfully', async () => {
//       const id = '1';
//       const changePasswordDto: ChangePasswordDto = {
//         currentPassword: 'oldpassword',
//         newPassword: 'newpassword',
//         newPasswordConfirmation: 'newpassword',
//       };
//       const user = { id, password: await bcrypt.hash('oldpassword', 10) };
//       mockUserService.findOne.mockResolvedValue(user);
//       mockUserService.update.mockResolvedValue(user);

//       const result = await authService.changePassword(id, changePasswordDto);

//       expect(result).toEqual({ message: 'Password updated successfully' });
//     });

//     it('should throw BadRequestException for incorrect current password', async () => {
//       const id = '1';
//       const changePasswordDto: ChangePasswordDto = {
//         currentPassword: 'wrongpassword',
//         newPassword: 'newpassword',
//         newPasswordConfirmation: 'newpassword',
//       };
//       const user = { id, password: await bcrypt.hash('correctpassword', 10) };
//       mockUserService.findOne.mockResolvedValue(user);

//       await expect(authService.changePassword(id, changePasswordDto)).rejects.toThrow(BadRequestException);
//     });

//     it('should throw BadRequestException if new passwords do not match', async () => {
//       const id = '1';
//       const changePasswordDto: ChangePasswordDto = {
//         currentPassword: 'currentpassword',
//         newPassword: 'newpassword',
//         newPasswordConfirmation: 'differentpassword',
//       };
//       const user = { id, password: await bcrypt.hash('currentpassword', 10) };
//       mockUserService.findOne.mockResolvedValue(user);

//       await expect(authService.changePassword(id, changePasswordDto)).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('validateToken', () => {
//     it('should return the decoded token if valid', () => {
//       const token = 'validtoken';
//       const decoded = { sub: '1', name: 'John Doe' };
//       mockJwtService.verify.mockReturnValue(decoded);

//       expect(authService.validateToken(token, false)).resolves.toEqual(decoded);
//     });

//     it('should return null if token is invalid', () => {
//       const token = 'invalidtoken';
//       mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });

//       expect(authService.validateToken(token, false)).resolves.toBeNull();
//     });
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendTokenDto } from './dto/send-token.dto';
import { ValidTokenDto } from './dto/valid-token.dto';
import { UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginUser: jest.fn(),
            registerUser: jest.fn(),
            changePassword: jest.fn(),
            generateToken: jest.fn(),
            sendTokenByEmail: jest.fn(),
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('loginUser', () => {
    it('should return token and user if credentials are valid', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'password' };
      const token = 'valid-token';
      const userResponse = { id: '1', email: 'test@test.com', 'name': 'teste' };

      jest.spyOn(authService, 'loginUser').mockResolvedValue({ token, userResponse });

      const result = await authController.loginUser(loginUserDto);
      expect(result).toEqual({ token, user: userResponse });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = { email: 'wrong@test.com', password: 'wrongpassword' };

      jest.spyOn(authService, 'loginUser').mockRejectedValue(new UnauthorizedException());

      await expect(authController.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerUser', () => {
    it('should return user and token on successful registration', async () => {
      const createUserDto: CreateUserDto = { 'name': 'teste', email: 'test@test.com', password: 'password' };
      const token = 'valid-token';
      const userResponse = { id: '1', email: 'test@test.com', 'name': 'teste' };

      jest.spyOn(authService, 'registerUser').mockResolvedValue({ token, userResponse });

      const result = await authController.registerUser(createUserDto);
      expect(result).toEqual({ user: userResponse, token });
    });

    it('should throw BadRequestException on validation error', async () => {
      const createUserDto: CreateUserDto = { 'name': 'teste', email: 'invalid', password: 'short' };

      jest.spyOn(authService, 'registerUser').mockRejectedValue(new BadRequestException());

      await expect(authController.registerUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('should return success message on successful password change', async () => {
      const id = '1';
      const changePasswordDto: ChangePasswordDto = { currentPassword: 'oldpassword', newPassword: 'newpassword', newPasswordConfirmation: "newpassword"};

      jest.spyOn(authService, 'changePassword').mockResolvedValue(undefined);

      const result = await authController.changePassword(id, changePasswordDto);
      expect(result).toEqual({ message: 'Password updated successfully.' });
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      const id = '1';
      const changePasswordDto: ChangePasswordDto = { currentPassword: 'wrongpassword', newPassword: 'newpassword', newPasswordConfirmation: "newpassword" };

      jest.spyOn(authService, 'changePassword').mockRejectedValue(new UnauthorizedException());

      await expect(authController.changePassword(id, changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('sendToken', () => {
    it('should return success message if token is sent successfully', async () => {
      const sendTokenDto: SendTokenDto = { email: 'test@test.com' };

      jest.spyOn(authService, 'generateToken').mockResolvedValue('valid-token');
      jest.spyOn(authService, 'sendTokenByEmail').mockResolvedValue(undefined);

      const result = await authController.sendToken(sendTokenDto);
      expect(result).toEqual({ message: 'Token sent to email.' });
    });

    it('should throw NotFound if sending email not exists', async () => {
      const sendTokenDto: SendTokenDto = { email: 'invalid@test.com' };

      jest.spyOn(authService, 'generateToken').mockRejectedValue(new NotFoundException());

      await expect(authController.sendToken(sendTokenDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyToken', () => {
    it('should return success message if token is valid', async () => {
      const validTokenDto: ValidTokenDto = { token: 'valid-token' };

      jest.spyOn(authService, 'validateToken').mockReturnValue(undefined);

      const result = await authController.verifyToken(validTokenDto);
      expect(result).toEqual({ message: 'Token is valid.' });
    });

    it('should throw BadRequestException if token is invalid', async () => {
      const validTokenDto: ValidTokenDto = { token: 'invalid-token' };

      jest.spyOn(authService, 'validateToken').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(authController.verifyToken(validTokenDto)).rejects.toThrow(BadRequestException);
    });
  });
});

import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  UseGuards, 
  Req, 
  Patch, 
  Param, 
  UnauthorizedException, 
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendTokenDto } from './dto/send-token.dto';
import { ValidTokenDto } from './dto/valid-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @HttpCode(200)
  @ApiOperation({ summary: 'User loging' })
  @ApiResponse({
    status: 200,
    description: 'User has successfully logged.',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'abc123' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials.',
        error: 'Unauthorized',
      },
    },
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const { token, userResponse } = await this.authService.loginUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      return { token, user: userResponse };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'User logout.' })
  @ApiResponse({ status: 204, description: 'User logged out.' })
  async logout(@Req() req): Promise<void> {
    const user = req.user;
    await this.authService.logout(user.token, user.exp);
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Register a user.' })
  @ApiResponse({ 
    status: 201, 
    description: 'The record has been successfully created.', 
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'abc123' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error.', 
    schema: { 
      example: { 
        statusCode: 400, 
        message: 'Validation failed.', 
        error: 'Bad Request' 
      } 
    } 
  })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const { token, userResponse } = await this.authService.registerUser(createUserDto);
      return { user: userResponse, token };
    } catch (error) {
      throw new BadRequestException('Validation failed.');
    }
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change password of a user.' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password updated successfully.', 
    schema: { example: { message: 'Password updated successfully.' } } 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Current password is incorrect.', 
    schema: { 
      example: { 
        statusCode: 401, 
        message: 'Current password is incorrect.', 
        error: 'Unauthorized' 
      } 
    } 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'New password and confirm password do not match.', 
    schema: { 
      example: { 
        statusCode: 400, 
        message: 'New password and confirm password do not match.', 
        error: 'Bad Request' 
      } 
    } 
  })
  async changePassword(
    @Param('id') id: string, 
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    try {
      await this.authService.changePassword(id, changePasswordDto);
      return { message: 'Password updated successfully.' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Current password is incorrect.');
      }
      throw new BadRequestException('New password and confirm password do not match.');
    }
  }

  @Post('send-token')
  @ApiOperation({ summary: 'Send a token to user email' })
  @ApiResponse({
    status: 200,
    description: 'Send a token to user email',
    schema: {
      example: {
        message: 'Send a token to user email',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async sendToken(@Body() sendTokenDto: SendTokenDto): Promise<{ message: string }> {
    try {
      const token = await this.authService.generateToken(sendTokenDto.email);
      await this.authService.sendTokenByEmail(sendTokenDto.email, token);
      return { message: 'Token sent to email.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify password reset token.' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid.', 
    schema: { example: { message: 'Token is valid.' } } 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid or expired token.', 
    schema: { 
      example: { 
        statusCode: 400, 
        message: 'Invalid token.', 
        error: 'Bad Request' 
      } 
    } 
  })
  async verifyToken(@Body() validTokenDto: ValidTokenDto): Promise<{ message: string }> {
    this.authService.validateToken(validTokenDto.token, true);
    return { message: 'Token is valid.' };
  }
}

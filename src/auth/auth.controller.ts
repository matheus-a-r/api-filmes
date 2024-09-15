import { Controller, Post, Body, HttpCode, UseGuards, Req, Patch, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @ApiOperation({ summary: 'User login.' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has successfully logged.', 
    type: LoginUserDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'The user was unable to login.', 
    schema: { 
      example: { 
        statusCode: 401, 
        message: 'Invalid credentials.', 
        error: 'Unauthorized' 
      } 
    } 
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try{
      const { token, userResponse } = await this.authService.loginUser(
        email,
        password,
      );
      return { token: token, user: userResponse };
    }catch(error){
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout.' })
  @ApiResponse({ status: 204, description: 'User logged out.' })
  async logout(@Req() req): Promise<void> {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logout(token);
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Register a user.' })
  @ApiResponse({ 
    status: 201, 
    description: 'The record has been successfully created.', 
    type: ResponseUserDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error', 
    schema: { 
      example: { 
        statusCode: 400, 
        message: 'Validation failed', 
        error: 'Bad Request' 
      } 
    } 
  })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const { token, userResponse } =
      await this.authService.registerUser(createUserDto);
    return { user: userResponse, token: token };
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change password from a user.' })
  @ApiResponse({ 
    status: 200, 
    description: 'User password changed.',
    schema:{
      example: {
        message: 'Password updated successfully.'
      } 
    }})
  @ApiResponse({ 
    status: 401, 
    description: 'Validation error', 
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
    description: 'Validation error', 
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
    return await this.authService.changePassword(id, changePasswordDto);
  }
}

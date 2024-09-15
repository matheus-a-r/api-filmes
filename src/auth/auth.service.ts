import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { BlacklistedToken } from './schemas/token.schema';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('BlacklistedToken')
    private readonly blacklistedTokenModel: Model<BlacklistedToken>,
    private readonly userService: UserService,
  ) {}

  async blacklistToken(token: string, expiresAt: Date): Promise<void> {
    const blacklistedToken = this.blacklistedTokenModel.create({
      token,
      expiresAt,
    });
    await blacklistedToken;
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenInBlacklist = await this.blacklistedTokenModel
      .findOne({ token });
    return !!tokenInBlacklist;
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ token: string; userResponse: ResponseUserDto }> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({
        name: user.name,
        sub: user.id,
      });
      const userResponse = { id: user.id, name: user.name, email:user.email }

      return { token,  userResponse};
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as any;
    const expiresAt = new Date(decoded.exp * 1000); 

    const blacklistedToken = new this.blacklistedTokenModel({ token, expiresAt });
    await blacklistedToken.save();
  }

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; userResponse: ResponseUserDto }> {
    const user = await this.userService.create({ ...createUserDto });

    const token = this.jwtService.sign({
      name: user.name,
      sub: user.id,
    });

    const userResponse = {id: user.id, name: user.name, email: user.email}

    return { token, userResponse };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{message: String}> {
    const { currentPassword, newPassword, newPasswordConfirmation } = changePasswordDto;
    
    const user = await this.userService.findOne(id);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect.');
    }
    
    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException('New password and confirm password do not match.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const userUpdated = await this.userService.update(user.id, {password: hashedPassword});

    if(userUpdated) return { message: 'Password updated successfully' }
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

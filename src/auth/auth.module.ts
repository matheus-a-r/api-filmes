import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/schema/user.schema';
import { JwtAuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { BlacklistedTokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'BlacklistedToken', schema: BlacklistedTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, UserService],
  exports: [AuthService, JwtAuthGuard, UserService],
})
export class AuthModule {}

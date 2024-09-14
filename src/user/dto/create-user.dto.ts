import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Username', example: 'João Silva' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'User email', example: 'joao@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

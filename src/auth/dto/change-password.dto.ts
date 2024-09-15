import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ description: 'User password', example: 'old_password' })
    @MinLength(6)
    @IsString()
    currentPassword: string;

    @ApiProperty({ description: 'New user password', example: 'new_password' })
    @MinLength(6)
    @IsString()
    newPassword: string;

    @ApiProperty({ description: 'Confirmation of new user password', example: 'new_password' })
    @MinLength(6)
    @IsString()
    newPasswordConfirmation: string;
}

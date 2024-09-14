import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseUserDto {
    @ApiProperty({description: "User id", example: '12345' })
    @IsString()
    id: string;

    @ApiProperty({description: "Username", example: 'João Silva' })
    @IsString()
    name: string;

    @ApiProperty({description: "User email", example: 'joao@gmail.com' })
    @IsString()
    email: string;
}
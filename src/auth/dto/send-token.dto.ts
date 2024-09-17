import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendTokenDto {
    @ApiProperty({ description: 'User email', example: 'example@gmail.com' })
    @IsString()
    email: string;

}

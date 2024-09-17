import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ValidTokenDto {
    @ApiProperty({ description: 'User token', example: 'yUHuhUasssdema' })
    @IsString()
    token: string;

}

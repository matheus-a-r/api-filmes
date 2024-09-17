import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseMovieDto {
    
    @ApiProperty({description: "Movie id", example: '12345' })
    @IsString()
    id: string;

    @ApiProperty({description: "Movie titel", example: 'The Grudge' })
    @IsString()
    title: string;

    @ApiProperty({description: "Movie year", example: '2020' })
    @IsString()
    year: number;
    
    @ApiProperty({description: "actors and actresses", example: ['Andrea Riseborough', 'Demián Bichir', 'John Cho'] })
    @IsString()
    cast: string[];

    @ApiProperty({description: "Movie genres", example: ['horror', 'supernatural'] })
    @IsString()
    genres: string[];

    @ApiProperty({description: "Href", example: 'Like_a_Boss_(film)' })
    @IsString()
    href: string;
    
    @ApiProperty({description: "synopsis", example: 'String' })
    @IsString()
    extract: string;
    
    @ApiProperty({description: "Image url", example: 'https://upload.wikimedia.org/wikipedia/en/9/9a/LikeaBossPoster.jpg' })
    @IsString()
    thumbnail: string;
    
    @ApiProperty({description: "Width image", example: 235 })
    @IsString()
    thumbnail_width: number;

    @ApiProperty({description: "Height image", example: 240 })
    @IsString()
    thumbnail_height: number;
}
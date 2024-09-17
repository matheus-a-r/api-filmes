import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService, private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a paginated list of movies with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'page_size', required: false, type: Number, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term to filter movies', example: 'horror' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Filter by release year', example: 2023 })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Field to order by', example: 'releaseDate' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Order direction', example: 'asc' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of movies',
    schema: {
      type: 'object',
      properties: {
        totalItems: { type: 'number', example: 100 },
        items: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'abc123' },
              title: { type: 'string', example: 'Inception' },
              year: { type: 'number', example: 2020 },
              cast: { 
                type: 'array',
                items: { type: 'string' },
                example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt']
              },
              genres: { 
                type: 'array',
                items: { type: 'string' },
                example: ['Action', 'Sci-Fi']
              },
              href: { type: 'string', example: 'https://example.com/movie' },
              extract: { type: 'string', example: 'A brief extract of the movie...' },
              thumbnail: { type: 'string', example: 'https://example.com/thumbnail.jpg' },
              thumbnail_width: { type: 'number', example: 200 },
              thumbnail_height: { type: 'number', example: 300 },
              },
          },
        },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(
    @Query('page') pageQ?: number,
    @Query('page_size') limitQ?: number,
    @Query('search') searchQ?: string,
    @Query('year') yearQ?: number,
    @Query('orderBy') orderByQ?: any,
    @Query('order') orderQ?: 'asc' | 'desc',
  ): Promise<{totalItems: number, items: any, page: number, limit: number,}> {
    const movies = await this.movieService.findAll(pageQ, limitQ, searchQ, yearQ, orderByQ, orderQ);

    const { totalItems, items, page, limit } = movies;

    return { totalItems, items, page, limit };
  }

  @Get("restrict")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a paginated list of movies with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'page_size', required: false, type: Number, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term to filter movies', example: 'horror' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Filter by release year', example: 2023 })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Field to order by', example: 'releaseDate' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Order direction', example: 'asc' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of movies',
    schema: {
      type: 'object',
      properties: {
        totalItems: { type: 'number', example: 100 },
        items: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'abc123' },
              title: { type: 'string', example: 'Inception' },
              year: { type: 'number', example: 2020 },
              cast: { 
                type: 'array',
                items: { type: 'string' },
                example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt']
              },
              genres: { 
                type: 'array',
                items: { type: 'string' },
                example: ['Action', 'Sci-Fi']
              },
              href: { type: 'string', example: 'https://example.com/movie' },
              extract: { type: 'string', example: 'A brief extract of the movie...' },
              thumbnail: { type: 'string', example: 'https://example.com/thumbnail.jpg' },
              thumbnail_width: { type: 'number', example: 200 },
              thumbnail_height: { type: 'number', example: 300 },
              },
          },
        },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 401, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAllRestrict(
    @Req() req,
    @Query('page') pageQ?: number,
    @Query('page_size') limitQ?: number,
    @Query('search') searchQ?: string,
    @Query('year') yearQ?: number,
    @Query('orderBy') orderByQ?: any,
    @Query('order') orderQ?: 'asc' | 'desc',
  ): Promise<{totalItems: number, items: any, page: number, limit: number,}> {
    const userId = req.user.sub;
    const user = await this.userService.findOne(userId);
    if(user.confirmedEmail){
      const movies = await this.movieService.findAll(pageQ, limitQ, searchQ, yearQ, orderByQ, orderQ);
  
      const { totalItems, items, page, limit } = movies;
  
      return { totalItems, items, page, limit };
    }
    throw new UnauthorizedException("User email has not been confirmed")
  }
}

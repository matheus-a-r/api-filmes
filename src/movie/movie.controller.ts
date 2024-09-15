import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') pageQ: number = 1,
    @Query('page_size') limitQ: number = 10,
    @Query('search') searchQ,
    @Query('year') yearQ,
    @Query('orderBy') orderByQ,
    @Query('order') orderQ,
  ): Promise<{totalItems: number, items: any, page: number, limit: number,}> {
    const movies = await this.movieService.findAll(pageQ, limitQ, searchQ, yearQ, orderByQ, orderQ );

    const {totalItems, items, page, limit} = movies

    return {totalItems, items, page, limit}
  }
}

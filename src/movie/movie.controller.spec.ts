import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

// Interface genérica para o retorno dos filmes
interface MovieDto {
  id: string;
  title: string;
  year: number;
  cast: string[];
  genres: string[];
  href: string;
  extract: string;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  // Mock do serviço de filmes
  const mockMovieService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
        {
            provide: AuthService,
            useValue: {}
        }
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const result = {
      totalItems: 100,
      items: [
        {
          id: 'abc123',
          title: 'Inception',
          year: 2020,
          cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
          genres: ['Action', 'Sci-Fi'],
          href: 'https://example.com/movie',
          extract: 'A brief extract of the movie...',
          thumbnail: 'https://example.com/thumbnail.jpg',
          thumbnail_width: 200,
          thumbnail_height: 300,
        } as MovieDto,
      ],
      page: 1,
      limit: 10,
    } as any;

    it('should return a paginated list of movies with default parameters', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });

    it('should return a paginated list of movies with specified page and page_size', async () => {
      const params = { pageQ: 2, limitQ: 5 };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(params.pageQ, params.limitQ, undefined, undefined, undefined, undefined)).toEqual(result);
    });

    it('should return a paginated list of movies with search term', async () => {
      const params = { searchQ: 'action' };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, 10, params.searchQ, undefined, undefined, undefined)).toEqual(result);
    });

    it('should return a paginated list of movies filtered by year', async () => {
      const params = { yearQ: 2023 };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, 10, undefined, params.yearQ, undefined, undefined)).toEqual(result);
    });

    it('should handle errors correctly', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new BadRequestException('Invalid parameters'));

      await expect(controller.findAll(1, 10, 'horror', 2023, 'releaseDate', 'asc')).rejects.toThrow(BadRequestException);
    });
  });
});

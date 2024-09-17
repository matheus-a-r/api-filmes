import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './interface/movie.interface';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
  @InjectModel('Movie') private readonly movieModel: Model<Movie>;

  async findAll(
    page: number,
    limit: number,
    search: string,
    year: number,
    orderBy: string,
    order: 'asc' | 'desc',
  ) {
    
    const query = this.movieModel.find();
    const totalItems = await this.movieModel.countDocuments(query.getFilter());

    if (year) {
      query.where('year').equals(year); 
    }

    
    if (search) {
      query.or([
        { title: { $regex: search, $options: 'i' } },
        { extract: { $regex: search, $options: 'i' } },
      ]);
    }

    
    if (orderBy) {
      const sortOption = order === 'desc' ? -1 : 1;
      query.sort({ [orderBy]: sortOption });
    }

    query.skip((page - 1) * limit).limit(limit);

    
    const items = await query.exec();

    return {
      totalItems,
      items,
      page,
      limit,
    };
  }
}


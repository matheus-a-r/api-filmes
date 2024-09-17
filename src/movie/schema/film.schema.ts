import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Movie extends Document {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;
  
  @Prop({ required: true, type: [String] })
  cast: string[];

  @Prop({ required: true, type: [String] })
  genres: string[];

  @Prop({ required: true })
  href: string;
  
  @Prop({ required: true })
  extract: string;
  
  @Prop({ required: true })
  thumbnail: string;
  
  @Prop({ required: true })
  thumbnail_width: number;

  @Prop({ required: true })
  thumbnail_height: number;

}

export const MovieSchema = SchemaFactory.createForClass(Movie);

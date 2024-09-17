import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  confirmedEmail: boolean
  
  @Prop({ required: true })
  password: string;


}

export const UserSchema = SchemaFactory.createForClass(User);

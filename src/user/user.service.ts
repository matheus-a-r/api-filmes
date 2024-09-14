import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interface/user.interface';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  @InjectModel('User') private readonly userModel: Model<User>
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await createdUser;

    return { id: user.id, name: user.name, email: user.email};
  }

  async findAll(): Promise<ResponseUserDto[]>{
    const users =  await this.userModel.find();
    const responseUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
    
    return responseUsers
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException(`The user ${id} does not exist.`)
    }
    
    return { id: user.id, name: user.name, email: user.email};
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

    if(!user){
      throw new NotFoundException(`The user ${id} does not exist.`)
    }
    
    return { id: user.id, name: user.name, email: user.email}
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if(!user){
      throw new NotFoundException(`The user ${id} does not exist.`)
    }

    return { id: user.id, name: user.name, email: user.email}
  }
}

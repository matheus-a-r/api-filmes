import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interface/user.interface';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectModel('User') private readonly userModel: Model<User>
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = this.userModel.create({
      ...createUserDto,
      confirmedEmail: false,
      password: hashedPassword,
    });

    const user = await createdUser;

    return user;
  }

  async findAll(): Promise<User[]>{
    const users =  await this.userModel.find();
    return users
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException(`The user ${id} does not exist.`)
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`The user ${email} does not exist.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
      if(!user){
        throw new NotFoundException(`The user ${id} does not exist.`)
      }
      
      return user
    }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);

    if(!user){
      throw new NotFoundException(`The user ${id} does not exist.`)
    }

    return user
  }
}

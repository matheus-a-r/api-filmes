import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  

  @Post()
  @ApiOperation({ summary: 'Create a user.' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ResponseUserDto
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email', 'password must be longer than 6 characters'],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Return all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'abc123' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john.doe@example.com' },
        },
      },
    },
  })
  async findAll(): Promise<ResponseUserDto[]> {
    const usersModel = await this.userService.findAll();
    const users = usersModel.map((user) => ({ id: user.id, name: user.name, email: user.email }));
    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a user by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully returned.', 
    type: ResponseUserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'The user has been successfully returned.', 
    schema: { 
      example: { 
        statusCode: 404, 
        message: 'The user does not exist.', 
        error: 'Not Found' 
      } 
    } 
  })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.userService.findOne(id);
    return {id: user.id, name: user.name, email: user.email};
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully updated.', 
    type: ResponseUserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'The user does not exist.', 
    schema: { 
      example: { 
        statusCode: 404, 
        message: 'The user does not exist.', 
        error: 'Not Found' 
      } 
    } 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error', 
    schema: { 
      example: { 
        statusCode: 400, 
        message: ['name should not be empty'], 
        error: 'Bad Request' 
      } 
    } 
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.update(id, updateUserDto);
    return {id: user.id, name: user.name, email: user.email};
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user by id.' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully removed.', 
    type: ResponseUserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'The user has been successfully removed.', 
    schema: { 
      example: { 
        statusCode: 404, 
        message: 'The user does not exist.', 
        error: 'Not Found' 
      } 
    } 
  })
  async remove(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.userService.remove(id)
    
    return {id: user.id, name: user.name, email: user.email};
  }
}

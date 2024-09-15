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
  @ApiOperation({ summary: 'Cria um usuário.' })
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
        message: 'Validation failed', 
        error: 'Bad Request' 
      } 
    } 
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Return all users' })
  @ApiResponse({ 
    status: 200, 
    description: '', 
    type: [ResponseUserDto] 
  })
  async findAll(): Promise<ResponseUserDto[]> {
    const usersModel = await this.userService.findAll();
    const users = usersModel.map((user) => ({id: user.id, name: user.name, email: user.email}))
    return users
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuário pelo id.' })
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
  @ApiOperation({ summary: 'Atualiza um usuário pelo id.' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully updated.', 
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.update(id, updateUserDto);
    return {id: user.id, name: user.name, email: user.email};
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo id.' })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully updated.', 
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
  async remove(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.userService.remove(id)
    
    return {id: user.id, name: user.name, email: user.email};
  }
}

import { ResponseUserDto } from "../dto/response-user.dto";
import { CreateUserDto } from "./create-user.dto";

export const ResponseUserDtoStub = (): ResponseUserDto => {
  return {
    id: "1",
    name: "Vinicius Santos de Pontes",
    email: "teste@gmail.com",
  };
};

export const CreateUserDtoStub = (): CreateUserDto => {
    return {
        name: "Vinicius Santos de Pontes",
        email: "teste@gmail.com",
        password: "password123"
    };
};
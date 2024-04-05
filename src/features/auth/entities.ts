import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}

export class SignInUserDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class SignInSuccessDto {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  username: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
}

export const isCreateUserPayload = (
  payload: any,
): payload is CreateUserPayload => {
  return (
    !!payload.email &&
    !!payload.password &&
    typeof payload.email == 'string' &&
    typeof payload.email == 'string'
  );
};

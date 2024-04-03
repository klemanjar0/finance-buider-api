import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class SignInUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class SignInSuccessDto {
  @ApiProperty()
  authToken: string;
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

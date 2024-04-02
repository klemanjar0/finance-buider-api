import { ApiProperty } from '@nestjs/swagger';

export interface CreateAccountPayload {
  name: string;
  description: string;
}

export class CreateAccountDto implements CreateAccountPayload {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export const isCreateAccountPayload = (
  payload: any,
): payload is CreateAccountPayload => {
  return (
    !!payload.name &&
    !!payload.description &&
    typeof payload.name == 'string' &&
    typeof payload.description == 'string'
  );
};

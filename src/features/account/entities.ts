import { ApiProperty } from '@nestjs/swagger';
import {
  IPageable,
  IPageableCount,
  IPageableDto,
  IPageableResponse,
  PageableCountDto,
} from '../../utils/common/types';
import { Account } from '../../models/account/AccountSchema';

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

export class GetAccountsDto implements IPageable {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class UpdateAccountDto extends Account {}

export class GetAccountsResponseDto {
  @ApiProperty({ description: 'Accounts array', type: () => [Account] })
  data: Account[];

  @ApiProperty()
  pageable: PageableCountDto;
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

export type GetAccountsOptions = IPageable;

import { ApiProperty } from '@nestjs/swagger';

export interface CreateTransactionPayload {
  value: number;
  accountId: string;
}

export class CreateTransactionDto implements CreateTransactionPayload {
  @ApiProperty()
  value: number;

  @ApiProperty()
  accountId: string;
}

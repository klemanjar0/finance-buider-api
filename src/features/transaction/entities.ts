import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export interface CreateTransactionPayload {
  value: number;
  description: string;
  type: string;
}

export class CreateTransactionDto implements CreateTransactionPayload {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;
}

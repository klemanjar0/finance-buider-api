import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/auth.guard';
import { Transaction } from '../../models/transaction/TransactionSchema';
import { CreateTransactionDto } from './entities';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Create transaction on specific account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns created transaction.',
    type: Transaction,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found.',
  })
  @ApiResponse({
    status: 406,
    description: 'Incorrect transaction value.',
  })
  create(@Body() payload: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(payload.accountId, payload);
  }
}

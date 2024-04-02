import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/auth.guard';
import { Transaction } from '../../models/transaction/TransactionSchema';
import { CreateTransactionDto } from './entities';
import { DeleteResult } from 'mongodb';
import { DeleteResultDto } from '../../utils/common/types';

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

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns delete result.',
    type: DeleteResultDto,
  })
  deleteById(@Param() params: { id: string }): Promise<DeleteResult> {
    return this.transactionService.deleteById(params.id);
  }
}

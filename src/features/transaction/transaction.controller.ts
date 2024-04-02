import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}

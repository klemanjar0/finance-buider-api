import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  DeleteTransactionDto,
  GetAccountsDto,
  GetAccountsResponseDto,
  GetTransactionsDto,
  GetTransactionsResponseDto,
  ToggleFavoriteAccountDto,
  UpdateAccountDto,
  WithUuidDto,
} from './entities';
import { Account } from '../../models/account/AccountSchema';
import { AuthGuard } from '../auth/auth.guard';
import { extractPageable, getUserIdFromRequest } from '../../utils/utility';
import { Transaction } from '../../models/transaction/TransactionSchema';
import { CreateTransactionDto } from '../transaction/entities';
import { DeleteResultDto } from '../../utils/common/types';
import * as mongoose from 'mongoose';

@ApiTags('Account')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @ApiBody({ type: CreateAccountDto })
  @ApiOperation({
    summary: 'Create a new account for the current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns created account.',
    type: Account,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body is not full.',
  })
  create(
    @Request() req: Request,
    @Body() payload: CreateAccountDto,
  ): Promise<Account> {
    const userId = getUserIdFromRequest(req);
    return this.accountService.create(userId, payload);
  }

  @UseGuards(AuthGuard)
  @Get('')
  @ApiQuery({ name: 'limit', type: mongoose.Schema.Types.Number })
  @ApiQuery({ name: 'offset', type: mongoose.Schema.Types.Number })
  @ApiQuery({ name: 'sort', type: mongoose.Schema.Types.String })
  @ApiOperation({
    summary: 'Get current user accounts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns accounts list.',
    type: GetAccountsResponseDto,
  })
  getAccounts(
    @Request() req: Request,
    @Query() payload: GetAccountsDto,
  ): Promise<GetAccountsResponseDto> {
    const userId = getUserIdFromRequest(req);
    const pageable = extractPageable(payload);
    return this.accountService.getAccounts(userId, {
      ...pageable,
      sort: payload.sort,
    });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns modified account.',
    type: Account,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body is not full.',
  })
  updateAccount(
    @Body() payload: UpdateAccountDto,
    @Param() params: WithUuidDto,
  ) {
    return this.accountService.updateAccount(params.id, payload);
  }

  @UseGuards(AuthGuard)
  @Put(':id/favorite')
  @ApiOperation({
    summary: 'Toggle favorite account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns favorite status.',
    type: ToggleFavoriteAccountDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  toggleFavoriteAccount(@Param() params: WithUuidDto) {
    return this.accountService.toggleFavorite(params.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete account.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns removed entity.',
    type: ToggleFavoriteAccountDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  deleteAccount(@Param() params: WithUuidDto) {
    return this.accountService.deleteAccount(params.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/transactions')
  @ApiBody({ type: CreateTransactionDto })
  @ApiOperation({
    summary: 'Create transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns created entity.',
    type: Transaction,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  createTransaction(
    @Param() params: WithUuidDto,
    @Body() body: CreateTransactionDto,
  ) {
    return this.accountService.createTransaction(params.id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/transactions/:transactionId')
  @ApiOperation({
    summary: 'Delete transaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns delete result.',
    type: DeleteResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  deleteTransaction(@Param() params: DeleteTransactionDto) {
    return this.accountService.deleteTransactionById(
      params.id,
      params.transactionId,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id/transactions')
  @ApiQuery({ name: 'limit', type: String })
  @ApiQuery({ name: 'offset', type: String })
  @ApiOperation({
    summary: 'Get accounts transactions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions list.',
    type: GetTransactionsResponseDto,
  })
  getTransactions(
    @Param() params: WithUuidDto,
    @Query() payload: GetTransactionsDto,
  ): Promise<GetTransactionsResponseDto> {
    const pageable = extractPageable(payload);
    return this.accountService.getAccountTransactions(params.id, pageable);
  }
}

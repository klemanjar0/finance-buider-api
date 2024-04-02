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
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  GetAccountsDto,
  GetAccountsResponseDto,
  ToggleFavoriteAccountDto,
  UpdateAccountDto,
} from './entities';
import { Account } from '../../models/account/AccountSchema';
import { AuthGuard } from '../auth/auth.guard';
import { extractPageable, getUserIdFromRequest } from '../../utils/utility';
import { IPageableDto } from '../../utils/common/types';

@ApiTags('Account')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @ApiOperation({
    summary: 'Create a new account for the current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns created account.',
    type: Account,
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
  @ApiQuery({ name: 'limit', type: String })
  @ApiQuery({ name: 'offset', type: String })
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
    return this.accountService.getAccounts(userId, pageable);
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
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  @ApiResponse({
    status: 422,
    description: 'Request body is not full.',
  })
  updateAccount(
    @Body() payload: UpdateAccountDto,
    @Param() params: { id: string },
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
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  toggleFavoriteAccount(@Param() params: { id: string }) {
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
    status: 404,
    description: 'Entity with provided id is not found.',
  })
  deleteAccount(@Param() params: { id: string }) {
    return this.accountService.deleteAccount(params.id);
  }
}

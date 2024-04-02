import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountDto } from './entities';
import { Account } from '../../models/account/AccountSchema';
import { AuthGuard } from '../auth/auth.guard';
import { getUserIdFromRequest } from '../../utils/utility';
import * as express from 'express';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBody({
    type: CreateAccountDto,
    examples: {
      Account: {
        description: 'Blank account schema',
        value: { name: 'My Account', description: 'Keep savings here' },
      },
    },
  })
  @ApiOperation({
    summary: 'Create a new account for the current user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns created account.',
    type: String,
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
}

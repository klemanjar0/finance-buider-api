import { Model, Schema } from 'mongoose';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../models/account/AccountSchema';
import {
  CreateAccountDto,
  CreateAccountPayload,
  GetAccountsOptions,
  isCreateAccountPayload,
  UpdateAccountDto,
} from './entities';
import { User } from '../../models/user/UserSchema';
import {
  DeleteResultDto,
  IPageableDto,
  IPageableResponse,
} from '../../utils/common/types';
import { buildPageable } from '../../utils/utility';
import { CreateTransactionPayload } from '../transaction/entities';
import {
  Transaction,
  TransactionModel,
} from '../../models/transaction/TransactionSchema';
import { DeleteResult } from 'mongodb';
import { pipe, drop, take, orderBy, size } from 'lodash/fp';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async create(userId: string, payload: CreateAccountDto): Promise<Account> {
    if (!isCreateAccountPayload(payload)) {
      throw new UnprocessableEntityException();
    }

    const user = await this.userModel.findOne({ id: userId });

    const account = new this.accountModel({
      id: uuidv4(),
      name: payload.name || 'Account',
      description: payload.description || '',
      createdAt: new Date(),
      currentBalance: 0,
      user: user._id,
      transactions: [],
      budget: payload.budget,
    });

    await account.save();

    return account.toJSON();
  }

  async getAccounts(
    userId: string,
    options: GetAccountsOptions,
  ): Promise<IPageableDto<Account>> {
    const { limit, offset } = options;
    const user = await this.userModel.findOne({ id: userId });
    const accountsCount = await this.accountModel
      .find({ user: user._id })
      .countDocuments();
    const accounts = await this.accountModel
      .find({ user: user._id }, { transactions: 0, user: 0 })
      .skip(offset)
      .limit(limit);

    return {
      data: accounts,
      pageable: buildPageable({ limit, offset, total: accountsCount }),
    };
  }

  async updateAccount(
    id: string,
    payload: Partial<UpdateAccountDto>,
  ): Promise<Account> {
    const modifiableFields: (keyof Account)[] = [
      'name',
      'description',
      'isFavorite',
      'budget',
    ];

    const account = await this.accountModel.findOne({ id: id });

    if (!account) {
      throw new NotFoundException();
    }

    modifiableFields.forEach((fieldName: keyof Account) => {
      if (
        payload[fieldName] &&
        typeof payload[fieldName] !== typeof account[fieldName]
      ) {
        throw new UnprocessableEntityException();
      }

      account.set(fieldName, payload[fieldName] ?? account[fieldName]);
    });

    await account.save();

    return account.toJSON();
  }

  async toggleFavorite(payload: string): Promise<{ status: boolean }> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    const prevValue = account.isFavorite;

    account.isFavorite = !prevValue;

    await account.save();

    return { status: account.isFavorite };
  }

  async deleteAccount(payload: string): Promise<Account> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    return this.accountModel.findOneAndDelete({ id: payload });
  }

  async getAccountById(payload: string): Promise<Account> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    return this.accountModel.findOne({ id: payload });
  }

  async getBalanceByAccountId(id: string) {
    const account = await this.accountModel.findOne({ id: id });

    const accountTransactions = account.transactions;

    return accountTransactions.reduce((acc, it) => it.value + acc, 0);
  }

  async setAccountCurrentBalance(id: string, payload: number): Promise<void> {
    const account = await this.accountModel.findOne({ id: id });

    if (!account) {
      throw new NotFoundException();
    }

    account.currentBalance = payload;

    await account.save();
  }

  async createTransaction(
    accountId: string,
    payload: CreateTransactionPayload,
  ): Promise<Transaction> {
    const account = await this.accountModel.findOne({ id: accountId });

    if (!account) {
      throw new NotFoundException(payload, 'Account not found.');
    }

    if (payload.value === 0 || !payload.value) {
      throw new NotAcceptableException(payload, 'Transaction cannot be zero.');
    }

    const transaction = new TransactionModel({
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      value: payload.value,
      description: payload.description,
      type: payload.type,
    });

    account.transactions.push(transaction);

    account.currentBalance = account.transactions.reduce(
      (acc, it) => acc + it.value,
      0,
    );

    await account.save();

    return transaction;
  }

  async deleteTransactionById(
    accountId: string,
    id: string,
  ): Promise<DeleteResultDto> {
    const account = await this.accountModel.findOne({ id: accountId });

    if (!account) {
      throw new NotFoundException(accountId, 'Account not found.');
    }

    const idx = account.transactions.findIndex((it) => String(it.id) === id);

    if (!account) {
      throw new NotFoundException(id, 'Transaction not found.');
    }

    const result = await account.transactions[idx].deleteOne();

    await account.save();

    return result;
  }

  async getAccountTransactions(accountId: string, options: GetAccountsOptions) {
    const { limit, offset } = options;
    const account = await this.accountModel.findOne({ id: accountId });

    const transactions = account.transactions;

    const count = size(transactions);

    const data = pipe(
      drop(offset),
      take(limit),
      orderBy(['createdAt'], ['desc']),
    )(transactions) as Transaction[];

    return {
      data,
      pageable: buildPageable({ limit, offset, total: count }),
    };
  }
}

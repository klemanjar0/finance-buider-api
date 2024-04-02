import { Model, Schema } from 'mongoose';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../models/account/AccountSchema';
import {
  CreateAccountPayload,
  GetAccountsOptions,
  isCreateAccountPayload,
} from './entities';
import { User } from '../../models/user/UserSchema';
import { IPageableResponse } from '../../utils/common/types';
import { buildPageable } from '../../utils/utility';
import { Transaction } from '../../models/transaction/TransactionSchema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(
    userId: string,
    payload: CreateAccountPayload,
  ): Promise<Account> {
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
    });

    await account.save();

    return account.toJSON();
  }

  async getAccounts(
    userId: string,
    options: GetAccountsOptions,
  ): Promise<IPageableResponse<Account>> {
    const { limit, offset } = options;
    const user = await this.userModel.findOne({ id: userId });
    const accountsCount = await this.accountModel
      .find({ user: user._id })
      .countDocuments();
    const accounts = await this.accountModel
      .find({ user: user._id })
      .skip(offset)
      .limit(limit);

    return {
      data: accounts,
      pageable: buildPageable({ limit, offset, total: accountsCount }),
    };
  }

  async updateAccount(id: string, payload: Partial<Account>): Promise<Account> {
    const modifiableFields: (keyof Account)[] = [
      'name',
      'description',
      'isFavorite',
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

    await this.transactionModel.deleteMany({
      account: account._id,
    });

    return this.accountModel.findOneAndDelete({ id: payload });
  }

  async getAccountById(payload: string): Promise<Account> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    return this.accountModel.findOne({ id: payload });
  }

  async setAccountCurrentBalance(id: string, payload: number): Promise<void> {
    const account = await this.accountModel.findOne({ id: id });

    if (!account) {
      throw new NotFoundException();
    }

    account.currentBalance = payload;

    await account.save();
  }
}

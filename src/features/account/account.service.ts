import { Model, Schema } from 'mongoose';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../models/account/AccountSchema';
import { CreateAccountPayload, isCreateAccountPayload } from './entities';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async create(payload: CreateAccountPayload): Promise<Account> {
    if (!isCreateAccountPayload(payload)) {
      throw new UnprocessableEntityException();
    }

    const account = new this.accountModel({
      id: uuidv4(),
      name: payload.name || 'Account',
      description: payload.description || '',
      createdAt: new Date(),
      currentBalance: 0,
    });

    await account.save();

    return account;
  }

  async makeFavorite(payload: string): Promise<void> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    const prevValue = account.isFavorite;

    account.isFavorite = !prevValue;

    await account.save();
  }
}

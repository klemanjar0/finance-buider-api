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
import { User } from '../../models/user/UserSchema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
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

  async updateAccount(id: string, payload: Partial<Account>): Promise<Account> {
    const modifiableFields: (keyof Account)[] = [
      'name',
      'description',
      'isFavorite',
    ];

    const account = await this.accountModel.findOne({ id: id });

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

  async toggleFavorite(payload: string): Promise<void> {
    const account = await this.accountModel.findOne({ id: payload });

    if (!account) {
      throw new NotFoundException();
    }

    const prevValue = account.isFavorite;

    account.isFavorite = !prevValue;

    await account.save();
  }
}

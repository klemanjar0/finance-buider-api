import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/user/UserSchema';
import { Model } from 'mongoose';
import { Account } from '../../models/account/AccountSchema';
import { Transaction } from '../../models/transaction/TransactionSchema';
import { CreateTransactionPayload } from './entities';
import { v4 as uuidv4 } from 'uuid';
import { AccountService } from '../account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  async getTransactionsByAccountId(id: string) {
    const account = await this.accountModel.findOne({ id: id });

    return (await this.transactionModel.find({
      account: account._id,
    })) as Transaction[];
  }

  async getBalanceByAccountId(id: string) {
    const account = await this.accountModel.findOne({ id: id });

    const accountTransactions = (await this.transactionModel.find({
      account: account._id,
    })) as Transaction[];

    return accountTransactions.reduce((acc, it) => it.value + acc, 0);
  }

  async create(
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

    const transaction = new this.transactionModel({
      id: uuidv4(),
      value: payload.value,
      account: account._id,
      createdAt: new Date(),
    });

    await transaction.save();

    const balanceByAccountId = await this.getBalanceByAccountId(accountId);

    await this.accountService.setAccountCurrentBalance(
      accountId,
      balanceByAccountId,
    );

    return transaction.toJSON();
  }
}

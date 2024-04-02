import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/user/UserSchema';
import { Model } from 'mongoose';
import { Account } from '../../models/account/AccountSchema';
import { Transaction } from '../../models/transaction/TransactionSchema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create() {}
}

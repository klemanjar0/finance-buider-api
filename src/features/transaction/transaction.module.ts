import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../../models/account/AccountSchema';
import { User, UserSchema } from '../../models/user/UserSchema';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {
  Transaction,
  TransactionSchema,
} from '../../models/transaction/TransactionSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

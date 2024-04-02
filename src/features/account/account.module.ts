import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../../models/account/AccountSchema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { User, UserSchema } from '../../models/user/UserSchema';
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
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}

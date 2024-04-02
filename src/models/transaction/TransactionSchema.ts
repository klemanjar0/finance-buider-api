import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../account/AccountSchema';

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @ApiProperty({
    example: '123-qwe-asd',
    description: 'Entity ID',
    required: true,
  })
  @Prop({ required: true })
  id: mongoose.Schema.Types.UUID;

  @ApiProperty({
    example: 123.45,
    description: 'Transaction value.',
    required: true,
  })
  @Prop({ default: 0 })
  value: number;

  @ApiProperty({
    example: '6asd6ahshiudh',
    description: 'Account key',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: Account;

  @ApiProperty()
  @Prop()
  createdAt: mongoose.Schema.Types.Date;

  @ApiProperty()
  @Prop()
  updatedAt: mongoose.Schema.Types.Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

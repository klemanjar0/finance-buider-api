import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

@Schema()
export class Transaction extends Document {
  @ApiProperty({
    example: '123-qwe-asd',
    description: 'Entity ID.',
    required: true,
  })
  @Prop({ required: true })
  id: mongoose.Schema.Types.UUID;

  @ApiProperty({
    example: 123.45,
    description: 'Transaction value.',
    required: true,
  })
  @Prop({ default: 0, required: true })
  value: number;

  @ApiProperty({
    example: 'Car payment',
    description: 'Transaction description.',
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: 'Groceries',
    description: 'Transaction type.',
  })
  @Prop()
  type: string;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export type TransactionModelType = mongoose.Model<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);

export const TransactionModel = mongoose.model<
  Transaction,
  TransactionModelType
>('Transaction', TransactionSchema);

TransactionSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/UserSchema';

export type AccountDocument = mongoose.HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({ required: true })
  id: mongoose.Schema.Types.UUID;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  currentBalance: number;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  createdAt: mongoose.Schema.Types.Date;

  @Prop()
  updatedAt: mongoose.Schema.Types.Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

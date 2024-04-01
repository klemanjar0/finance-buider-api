import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  id: mongoose.Schema.Types.UUID;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt: mongoose.Schema.Types.Date;

  @Prop()
  updatedAt: mongoose.Schema.Types.Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

// import { Schema, Document, model } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, isRequired: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6, isRequired: true })
  password: string;

  @Prop({ required: true, isRequired: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

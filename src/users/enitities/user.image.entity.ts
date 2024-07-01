import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserImageDocument = HydratedDocument<UserImage>;

@Schema()
export class UserImage {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  image: string; // Base64-encoded image
}

export const UserImageSchema = SchemaFactory.createForClass(UserImage);

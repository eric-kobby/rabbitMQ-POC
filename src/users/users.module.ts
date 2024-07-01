import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from '../email/email.service';
import { UserQueueModule } from '../user-queue-module/user-queue-module.module';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserImage, UserImageSchema } from './enitities/user.image.entity';
import { User, UserSchema } from './enitities/user.entity';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://reqres.in',
    }),
    EmailModule,
    MongooseModule.forFeature([
      { name: UserImage.name, schema: UserImageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserQueueModule,
    UsersModule,
    EmailModule,
    UserQueueModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}

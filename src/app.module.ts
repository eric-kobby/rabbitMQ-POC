import * as dotEnv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

dotEnv.config();

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, MongooseModule.forRoot(process.env.MONGO_URI)],
})
export class AppModule {}

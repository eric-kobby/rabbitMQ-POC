import * as dotEnv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

dotEnv.config();

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

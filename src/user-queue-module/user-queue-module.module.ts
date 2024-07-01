import { Module } from '@nestjs/common';
import { UserProducerService } from './user-producer.service';

@Module({
  providers: [UserProducerService],
  exports: [UserProducerService],
})
export class UserQueueModule {}

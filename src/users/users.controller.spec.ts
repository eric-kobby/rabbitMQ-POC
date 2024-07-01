import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailService } from '../email/email.service';
import { UserProducerService } from '../user-queue-module/user-producer.service';
import { UsersModule } from './users.module';
import { EmailModule } from '../email/email.module';
import { UserQueueModule } from '../user-queue-module/user-queue-module.module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, EmailService, UserProducerService],
      imports: [UsersModule, EmailModule, UserQueueModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

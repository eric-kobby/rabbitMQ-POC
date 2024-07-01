import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { UserCreatedDto } from './dto/user-created.dto';
import { User, UserSchema } from './enitities/user.entity';
import { UsersModule } from './users.module';
import { EmailModule } from '../email/email.module';
import { UserQueueModule } from '../user-queue-module/user-queue-module.module';
import { UserImage, UserImageSchema } from './enitities/user.image.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
      imports: [
        UsersModule,
        EmailModule,
        UserQueueModule,
        MongooseModule.forFeature([
          { name: UserImage.name, schema: UserImageSchema },
        ]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const createdUser: UserCreatedDto = {
      _id: 'someid',
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    };

    userModel.create(createdUser);

    const result = await service.create(createUserDto);

    expect(result).toEqual(createdUser);
  });

  // Add more test cases for other methods like findOne, removeAvatar, etc.
});

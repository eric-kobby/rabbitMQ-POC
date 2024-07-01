import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import type { CreateUserDto } from './dto/create-user.dto';
import type { GetUserDto } from './dto/get-user.dto';

import { EmailService } from '../email/email.service';
import { UserProducerService } from '../user-queue-module/user-producer.service';
import { UserCreatedDto } from './dto/user-created.dto';
import { UserImage, UserImageDocument } from './enitities/user.image.entity';
import { UsersModule } from './users.module';
import { User } from './enitities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
    private readonly userProducer: UserProducerService,
    @InjectModel(User.name)
    private userModel: Model<UsersModule>,
    @InjectModel(UserImage.name)
    private userImageModel: Model<UserImageDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }
    const user = new this.userModel(createUserDto);
    await user.save();
    this.emailService.sendMail({
      email: createUserDto.email,
      html: `User account has been created`,
      subject: 'User Account created',
    });

    const created = {
      ...user.toObject({ versionKey: false }),
    } as UserCreatedDto;

    await this.userProducer.sendUserCreatedEvent(created);

    return created;
  }

  async findOne(userId: number): Promise<GetUserDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<Readonly<GetUserDto>>(`/api/users/${userId}`).pipe(
        catchError(() => {
          throw `An error while trying to fetch user with id: ${userId}`;
        }),
      ),
    );
    return data;
  }

  async getUserAvatar(userId: number): Promise<string> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');
    return await this.getBase64Image(user.data.avatar, user.data.id);
  }

  async removeAvatar(userId: number) {
    await this.deleteUserImage(userId);
  }

  async getBase64Image(avatarUrl: string, userId: number) {
    const existingImage = await this.userImageModel.findOne({ userId }).exec();

    if (existingImage) {
      return existingImage.image;
    }
    const avatarResponse = await firstValueFrom(
      this.httpService.get(avatarUrl, { responseType: 'arraybuffer' }),
    );
    // perform transformation
    const imageBuffer = Buffer.from(avatarResponse.data, 'binary');
    const base64Image = imageBuffer.toString('base64');

    // Save the image as plain file
    const imageDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }
    const imagePath = path.join(imageDir, `${userId}.jpg`);
    fs.writeFileSync(imagePath, imageBuffer);

    const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
    const userImage = new this.userImageModel({
      userId,
      hash,
      image: base64Image,
    });
    await userImage.save();

    return base64Image;
  }

  async deleteUserImage(userId: number): Promise<void> {
    const existingImage = await this.userImageModel.findOne({ userId }).exec();
    if (!existingImage) {
      throw new NotFoundException('User image not found');
    }

    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      'images',
      `${userId}.jpg`,
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the entry from the database
    await this.userImageModel.deleteOne({ userId }).exec();
  }
}

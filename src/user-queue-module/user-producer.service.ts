import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import type { Channel } from 'amqplib';
import { UserCreatedDto } from '../users/dto/user-created.dto';

@Injectable()
export class UserProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect([process.env.RABBIT_MQ]);
    connection.on('connectFailed', (error) => console.log(error));
    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertQueue('user.created', {
          durable: true,
        });
      },
    });
  }

  async sendUserCreatedEvent(user: UserCreatedDto) {
    try {
      return await this.channelWrapper.sendToQueue(
        'user.created',
        Buffer.from(JSON.stringify(user)),
        { persistent: true },
      );
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }
}

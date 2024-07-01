import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Global, Injectable } from '@nestjs/common';
import type { MailOptions } from '../types';

@Injectable()
@Global()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(options: MailOptions) {
    try {
      const message = {
        to: options.email,
        subject: options.subject,
        html: options.html,
      } satisfies ISendMailOptions;
      const result = await this.mailService.sendMail(message);
      return result;
    } catch (error) {
      console.log('email sending error', error);
    }
  }
}

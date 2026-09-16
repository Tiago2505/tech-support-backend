import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendEmailOptions } from './interfaces';
import { handleError } from 'src/common';
@Injectable()
export class SendEmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, htmlBody } = options;

    try {
      const { error } = await this.resend.emails.send({
        from: `Tech Support <${this.configService.get<string>('MAILER_EMAIL')}>`,
        to,
        subject,
        html: htmlBody,
      });

      if (error) {
        throw new InternalServerErrorException('Could not send email');
      }
    } catch (error) {
      handleError(error);
    }
  }
}

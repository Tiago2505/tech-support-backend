import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from "resend";
import { SendEmailOptions } from './interfaces';
@Injectable()
export class SendEmailService {

  private readonly resend: Resend;

  constructor(
    private readonly configService: ConfigService,

  ){
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'))

  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, subject, htmlBody } = options;

    try {

      const { data, error } = await this.resend.emails.send({
        from: `Tech Support <${this.configService.get('MAILER_MAIL')}>`,
        to,
        subject,
        html: htmlBody,
      });

      if (error) {
        console.error("Error de Resend:");
        console.error(error);

        return false;
      }


      return true;
    } catch (error) {

      return false;
    }
  }
  
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendEmailService } from './send-email.service';

@Module({
  providers: [SendEmailService],
  imports: [ConfigModule],
  exports: [SendEmailService]
})
export class SendEmailModule {}

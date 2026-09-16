import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthMiddleware } from 'src/common/middlewares';
import { SendEmailModule } from 'src/send-email/send-email.module';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCode } from './entities';

@Module({
  controllers: [],
  providers: [VerificationCodeService],
  imports: [TypeOrmModule.forFeature([VerificationCode]), UsersModule, SendEmailModule],
  exports: [VerificationCodeService]
})
export class VerificationCodeModule {

  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('reset-password')
  }

}

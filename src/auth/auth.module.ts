import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'src/common/middlewares';
import { SendEmailModule } from 'src/send-email/send-email.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';

@Module({
  imports: [UsersModule, ConfigModule, VerificationCodeModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'auth/change-password',
        method: RequestMethod.POST,
      },
      {
        path: 'auth/forgot-password',
        method: RequestMethod.POST
      },
      {
        path: 'auth/verify-code',
        method: RequestMethod.POST
      },
      {
        path: 'auth/reset-password',
        method: RequestMethod.POST
      },
    );
  }
}

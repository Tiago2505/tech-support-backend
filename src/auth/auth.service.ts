import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
  ChangePasswordDto,
  LoginDto,
  ResetPasswordDto,
  VerifyPasswordResetCodeDto,
} from './dto';
import { CreateUserDto } from 'src/users/dto';
import { ConfigService } from '@nestjs/config';
import { BcryptAdapter, handleError, JwtAdapter } from 'src/common';
import { SendEmailService } from 'src/send-email/send-email.service';
import { SendEmailOptions } from 'src/send-email/interfaces';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';

@Injectable()
export class AuthService {
  
  private seed: string;

  constructor(
    private readonly usersService: UsersService,

    private readonly configService: ConfigService,
    private readonly verificationCodeService: VerificationCodeService,
  ) {
    this.seed = this.configService.get<string>('SEED')!;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);


      const payload = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      };

      const token = await JwtAdapter.generateToken(this.seed!, payload);
      return {
        user,
        token,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.usersService.findOne(email);

      if (!user)
        throw new NotFoundException(`User with email ${email} not found`);

      const userDB = await this.usersService.findOneWithPassword(email);

      if (!BcryptAdapter.compare(password, userDB!.password)) {
        throw new UnauthorizedException('The password does not match');
      }

      const seed = this.configService.get<string>('SEED');

      const payload = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      };

      const token = await JwtAdapter.generateToken(seed!, payload);

      return {
        user,
        token,
      };
    } catch (error) {
      handleError(error);
    }
  }

  private async validateNewPassword(
    newPassword: string,
    confirmPassword: string,
    currentPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    const isSamePassword = await BcryptAdapter.compare(
      newPassword,
      currentPassword,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'The new password must be different from the current password',
      );
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.usersService.findOneWithPassword(email);

      const { password, ...properties } = user;
      const { currentPassword, newPassword, confirmPassword } =
        changePasswordDto;

      const match = BcryptAdapter.compare(currentPassword, password);

      if (!match) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      await this.validateNewPassword(newPassword, confirmPassword, password);

      const hashedPassword = BcryptAdapter.hash(newPassword);

      await this.usersService.updatePassword(properties.id, hashedPassword);

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async requestPasswordReset(userId: number, email: string) {
    try {
      const sendCode =
        await this.verificationCodeService.createNewPasswordReset(
          userId,
          email,
        );
      return sendCode;
    } catch (error) {
      handleError(error);
    }
  }

  async verifyPasswordResetCode(
    userId: number,
    verifyPasswordResetCodeDto: VerifyPasswordResetCodeDto,
  ) {
    try {
      const verifiedCode = await this.verificationCodeService.verifyCode(
        userId,
        verifyPasswordResetCodeDto.code,
      );

      const payload ={
        userId
      }

      const passwordResetToken = await JwtAdapter.generateToken(this.seed, payload, '10m');

      return {
        code: verifiedCode,
        passwordResetToken
      };
    } catch (error) {
      handleError(error);
    }
  }

  async resetPassword(email: string, resetPasswordDto: ResetPasswordDto) {
    try {

      const payload = await JwtAdapter.validateToken(resetPasswordDto.passwordResetToken, this.seed);

      if(!payload) throw new UnauthorizedException('Invalid or expired password reset token');

      const user = await this.usersService.findOneWithPassword(email);

      const { newPassword, confirmPassword } = resetPasswordDto;

      await this.validateNewPassword(
        newPassword,
        confirmPassword,
        user.password,
      );

      const hashedPassword = BcryptAdapter.hash(newPassword);

      await this.usersService.updatePassword(user.id, hashedPassword);

      return await this.usersService.findOne(user.id);
    } catch (error) {
      handleError(error);
    }
  }
}

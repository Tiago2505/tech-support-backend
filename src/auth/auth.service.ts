import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
  ChangePasswordByAdminDto,
  ChangePasswordDto,
  LoginDto,
  RequestPasswordReset,
  ResetPasswordDto,
  VerifyPasswordResetCodeDto,
} from './dto';
import { CreateUserDto } from 'src/users/dto';
import { ConfigService } from '@nestjs/config';
import { BcryptAdapter, handleError, JwtAdapter } from 'src/common';
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

  async changePasswordByAdmin(
    userId: number,
    changePasswordDto: ChangePasswordByAdminDto,
  ) {
    try {
      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new NotFoundException(`User with id: ${userId} not found`);
      }

      const { newPassword, confirmPassword } = changePasswordDto;

      if (newPassword !== confirmPassword) {
        throw new BadRequestException(
          'New password and confirmation do not match',
        );
      }

      const userWithPassword = await this.usersService.findOneWithPassword(
        user.email,
      );

      const isSamePassword = await BcryptAdapter.compare(
        newPassword,
        userWithPassword.password,
      );

      if (isSamePassword) {
        throw new BadRequestException(
          'The new password must be different from the current password',
        );
      }

      const hashedPassword = BcryptAdapter.hash(newPassword);

      await this.usersService.updatePassword(
        userId,
        hashedPassword,
      );

      return await this.usersService.findOne(userId);
    } catch (error) {
      handleError(error);
    }
  }

  async requestPasswordReset(requestPasswordReset: RequestPasswordReset) {
    try {
      const user = await this.usersService.findOne(requestPasswordReset.email);

      if (!user) throw new NotFoundException('User not found');

      const sendCode =
        await this.verificationCodeService.createNewPasswordReset(
          user.id,
          user.email,
        );
      return sendCode;
    } catch (error) {
      handleError(error);
    }
  }

  async verifyPasswordResetCode(
    verifyPasswordResetCodeDto: VerifyPasswordResetCodeDto,
  ) {
    try {
      const user = await this.usersService.findOne(
        verifyPasswordResetCodeDto.email,
      );

      if (!user) throw new NotFoundException('User not found');

      const verifiedCode = await this.verificationCodeService.verifyCode(
        user.id,
        verifyPasswordResetCodeDto.code,
      );

      const payload = {
        userId: user.id,
      };

      const passwordResetToken = await JwtAdapter.generateToken(
        this.seed,
        payload,
        '10m',
      );

      return {
        code: verifiedCode,
        passwordResetToken,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = await JwtAdapter.validateToken(
        resetPasswordDto.passwordResetToken,
        this.seed,
      );

      if (!payload)
        throw new UnauthorizedException(
          'Invalid or expired password reset token',
        );

      const user = await this.usersService.findOneWithPassword(
        resetPasswordDto.email,
      );

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

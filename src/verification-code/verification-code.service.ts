import { BadRequestException, Injectable } from '@nestjs/common';
import crypto from "crypto";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPassword } from './entities';
import { passwordResetTemplate } from './templates';
import { SendEmailService } from 'src/send-email/send-email.service';
import { handleError } from 'src/common';


@Injectable()
export class VerificationCodeService {

  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly sendEmailService: SendEmailService
  ){}
  
  private generateNewCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private generateExpiresDate(): Date {
    return new Date(Date.now() + 10 * 60 * 1000);
  }


  async createNewPasswordReset( userId: number, email: string ){ 

    try {
      
      const newCode = this.resetPasswordRepository.create({
          code: this.generateNewCode(),
          expiresAt: this.generateExpiresDate(),
          userId: userId,
      });
  
      await this.resetPasswordRepository.save(newCode);
  
      const htmlBody: string = passwordResetTemplate(newCode.code);
  
      const options = {
        to: email,
        subject: "Reset password",
        htmlBody: htmlBody,
      };
  
      await this.sendEmailService.sendEmail(options);
  
      return newCode;

    } catch (error) {
      handleError(error);
    }

  }

  async verifyCode (userId: number, code: string){
    

    const codeExists = await this.resetPasswordRepository.findOne({
      where: {
        userId,
        code: code,
        used: false,
      },
    });

    if (!codeExists)
      throw new BadRequestException(`Invalid verification code`);

    if (codeExists.expiresAt < new Date()) {
      throw new BadRequestException("Invalid verification code");
    }

    const codeHasUsed = await this.resetPasswordRepository.update(codeExists.id, {
      used: true
    });

    return codeHasUsed;
  };

}

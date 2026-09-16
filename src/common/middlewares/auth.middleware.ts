import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAdapter } from '../config';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { handleError } from '../helpers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authorization = req.header('Authorization');

    if (!authorization) throw new UnauthorizedException('No token provided');

    if (!authorization.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid bearer token');

    const token = authorization.split(' ')[1] || '';

    const seed = this.configService.get('SEED');

    try {
      const payload = (await JwtAdapter.validateToken(token, seed)) as {
        id: string;
      };

      if (!payload) throw new UnauthorizedException('invalid token');

      const user = await this.userService.findOne(payload.id);

      if (!user) throw new NotFoundException('user not found');

      if(!user.isActive) throw new ForbiddenException('The action cannot be performed because the user is inactive');

      req.user = user;

      next();
    } catch (error) {
      handleError(error);
    }
  }
}

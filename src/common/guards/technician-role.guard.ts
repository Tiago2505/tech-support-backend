import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class TechnicianRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   const request = context.switchToHttp().getRequest();
   
       const user = request.user;
   
       if (!user) {
         throw new ForbiddenException('User not authenticated');
       }
   
       if (user.role !== 'ADMIN' && user.role !== 'TECHNICIAN') {
         throw new ForbiddenException(
           'You do not have permission to perform this action',
         );
       }
   
       return true;
  }
}

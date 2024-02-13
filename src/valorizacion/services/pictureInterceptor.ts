import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UnauthorizedException,
   } from '@nestjs/common';
   import { Observable } from 'rxjs';
   
   export class PictureInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];
      console.log({"auth eader":req.headers})
      console.log({"auth req":authHeader})
      const token = authHeader && authHeader.split(' ')[1];
   
      console.log('token siiii', token);
      console.log('auth siiii ', authHeader);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      return handler.handle();
    }
   }
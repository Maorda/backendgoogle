import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, tap } from 'rxjs/operators';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AuthService } from 'src/auth/services/auth.service';


@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly songsService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();

    const lang = this.songsService.buscarUsuario(ctx.getRequest().params.token);
    

    const fileIntConst = FileInterceptor('upfile', {
        storage: multer.diskStorage({
          destination: function(req, file, cb) {
            cb(null, `./songs/${lang}`);
          },
          filename: function(req, file, cb) {
            cb(null, `${lang}`);
          },
        }),
      });
  
      const fileInt = new fileIntConst();
  
      return fileInt.intercept(context,next);
  }
}
import { ConflictException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthDto } from '../dtos/auth.dto';
import { AuthEntity } from '../entity/auth.entity';
import { IAuthRepository, IAUTH_REPOSITORY } from '../patronAdapter/auth.interface.repository';

@Injectable()
export class AuthService {
    constructor(
        @Inject(IAUTH_REPOSITORY) private authRepository:IAuthRepository,
        private jwtService:JwtService
        ){ }

    async validateUser(email:string,password:string):Promise<any>{
        const usuario = await this.authRepository.findOne({email});
        if(usuario && usuario.password === password){
          const {password, email, ...rest} = usuario;
            return rest
        }
        console.log('no tiene permiso')
        throw new UnauthorizedException()
        
    }
    async login(userObjectLogin:AuthDto){

        const {email, password} = userObjectLogin;

        const findUser = await this.authRepository.findOne({email})
        console.log(findUser)
        if(!findUser){
            console.log('usuario no encontrado')
            throw new HttpException('USER_NOT_FOUND',404)
          } 
          
          const checkPaswword = await bcrypt.compare(password,findUser.password);
          
          if(!checkPaswword) {
            console.log('password no coincide')
            throw new HttpException('PASSWORD_NOT_FOUND',403)
          }
          const payload = {
            id:findUser.usuarioId,
            email:findUser.email
          }
          const token:string =  this.jwtService.sign(payload)
          const data = {
            usuario : findUser,
            token
          }
          
          return data
    }
    async create(userObjectCreate: AuthDto):Promise<AuthEntity> {
      const {email} = userObjectCreate
        const usrExist = await this.authRepository.findOne({email})
        if(usrExist){
            throw new ConflictException("Usuario Registrado")
        }
      
      const {password} = userObjectCreate;
      
      const plainToHash = await bcrypt.hash(password,10);
      userObjectCreate  = {...userObjectCreate, password:plainToHash}
     

      return await this.authRepository.register(userObjectCreate)
    }
    async lista(){
      return this.authRepository.lista()
    }
    
    async buscarUsuario(token:string){
      
      return this.jwtService.decode(token)
      

    }
    
    
    
}

  

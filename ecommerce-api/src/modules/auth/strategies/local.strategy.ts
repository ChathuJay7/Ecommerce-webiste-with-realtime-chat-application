import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthLoginDto } from "../dto/auth-login.dto";


import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string){
        const user = await this.authService.validateUserCreds(email, password);
        if(!user){
            throw new UnauthorizedException('Not Authorized');
        }
        return user;
    }
}
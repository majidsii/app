import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiretaion: false,
            secretOrKey: 'SHABIN',
        });
    }
    async validate(paylod: any) {
        return {
            id: paylod.sub,
            email: paylod.email,
        };
    }
}

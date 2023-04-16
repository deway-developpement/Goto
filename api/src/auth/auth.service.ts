import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, credidential: user.credidential };
        const refresh_token = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: this.configService.get<number>('jwt.refreshExpiresIn') }
        );
        await this.usersService.update(user.id, { refresh_token: refresh_token });
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refresh_token,
        };
    }

    async refresh(req: any) {
        if (!req.headers?.refresh_token) throw new UnauthorizedException();
        const decoded = this.jwtService.verify(req.headers.refresh_token);
        const user = await this.usersService.findById(decoded.sub);
        console.log('refresh', decoded, user);
        console.log(user, req.headers?.refresh_token, user?.refresh_token);
        if (req.headers.refresh_token === user?.refresh_token) {
            return this.login(user);
        } else {
            if (user) await this.usersService.update(user.id, { refresh_token: null });
            throw new UnauthorizedException();
        }
    }
}

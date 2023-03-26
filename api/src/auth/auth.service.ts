import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email, 'email');
        if (user && await compare(pass, user.password)) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id, credidential: user.credidential };
        const refresh_token = this.jwtService.sign(
            { sub: user._id },
            { expiresIn: this.configService.get<number>('jwt.refreshExpiresIn') }
        );
        await this.usersService.update(user._id, { refresh_token: refresh_token });
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refresh_token,
        };
    }

    async refresh(req: any) {
        if (!req.headers.refresh_token) {
            throw new UnauthorizedException();
        }
        const decoded = this.jwtService.decode(req.headers.refresh_token);
        const user = await this.usersService.findOne(decoded.sub);
        if (!user) {
            throw new UnauthorizedException();
        } else if (
            req.headers.refresh_token == user.refresh_token &&
            this.jwtService.verify(req.headers.refresh_token)
        ) {
            return this.login(user);
        } else {
            await this.usersService.update(user._id, { refresh_token: null });
            throw new UnauthorizedException();
        }
    }

    async verifyToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return this.usersService.findOne(payload.sub, '_id');
        } catch (err) {
            return null;
        }
    }
}

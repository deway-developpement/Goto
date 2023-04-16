import {
    Controller,
    Request,
    Post,
    UseGuards,
    Get,
    Param,
    Inject,
    StreamableFile,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { FileType } from './file/file.service';

@Controller()
export class AppController {
    constructor(
        private authService: AuthService,
        @Inject(AppService) private readonly appService: AppService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('auth/refresh')
    async refresh(@Request() req) {
        return this.authService.refresh(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('files/:category/:id')
    getFile(@Param('id') id: string, @Param('category') category: FileType): StreamableFile {
        return this.appService.getFileStream(category, category);
    }
}

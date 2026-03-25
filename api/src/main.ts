import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(); //! to remove after testing
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // allow file upload up to 10MB
    // allow hook at shutdown
    app.enableShutdownHooks();
    await app.listen(app.get(ConfigService).get<number>('port', 3000));
}
bootstrap();

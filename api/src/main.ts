import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(); //! to remove after testing
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // allow file upload up to 1MB
    // allow hook at shutdown
    app.enableShutdownHooks();
    await app.listen(3000);
}
bootstrap();

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/validation';
import { setHttpPlugin } from './auth/graphQL.plugin';
import { ApolloArmor } from '@escape.tech/graphql-armor';
import { regexDirectiveTransformer } from './directives/constraints.graphql';
import { DirectiveLocation, GraphQLDirective, GraphQLString } from 'graphql';
import { LoggerMiddleware } from './logger/logger.middleware';
import { HikeModule } from './hike/hikes.module';
import { TagModule } from './tags/tags.module';

const armor = new ApolloArmor();
const protection = armor.protect();

const log = console.log;

console.log = function (...args) {
    log.apply(
        console,
        [
            '\x1b[4m\x1b[36m%s\x1b[0m',
            'LOG',
            '\x1b[31m#',
            new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
            ':\x1b[0m',
        ].concat(args)
    );
};

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/config/env/.env`,
            load: [configuration],
            isGlobal: true,
            validationSchema,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            imports: [AuthModule, UsersModule],
            autoSchemaFile: 'schema.gql',
            uploads: false,
            transformSchema: (schema) => regexDirectiveTransformer(schema, 'constraint'),
            buildSchemaOptions: {
                directives: [
                    new GraphQLDirective({
                        name: 'constraint',
                        args: {
                            pattern: {
                                type: GraphQLString,
                            },
                        },
                        locations: [DirectiveLocation.FIELD_DEFINITION],
                    }),
                ],
            },
            context: async ({ extra }) => {
                return extra;
            },
            plugins: [setHttpPlugin, ...protection.plugins],
            validationRules: [...protection.validationRules],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: 'Goto',
                entities: ['dist/**/*.entity.js'],
                synchronize: process.env.NODE_ENV === 'development',
                charset: 'utf8mb4',
                // load default values into the database
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        HikeModule,
        TagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}

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
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { PubSubModule } from './pubsub/pubsub.module';
import { PubSubEngine } from 'type-graphql';
import { LoggerMiddleware } from './logger/logger.middleware';

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
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [AuthModule, UsersModule],
            useFactory: async (
                authService: AuthService,
                usersService: UsersService,
                pubSub: PubSubEngine
            ) => ({
                autoSchemaFile: 'schema.gql',
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
                subscriptions: {
                    'graphql-ws': {
                        onConnect: async (ctx) => {
                            const { connectionParams } = ctx;
                            const token = connectionParams.Authorization.split(' ')[1];
                            if (token) {
                                const user = await authService.verifyToken(token);
                                if (user) {
                                    console.log('user connected', user.pseudo);
                                    ctx.extra.req = {
                                        user: {
                                            ...user,
                                        },
                                    };
                                } else {
                                    console.log('Unauthorized');
                                }
                            } else {
                                console.log('no token');
                            }
                        },
                        onDisconnect: ({ extra }) => {
                            if (extra.req?.user) {
                                console.log('user disconnected', extra.req.user.pseudo);
                                usersService.connectedUsers = usersService.connectedUsers.filter(
                                    (user) => user._id !== extra.req.user._id
                                );
                                pubSub.publish('connectedUser', {
                                    connectedUser: extra.req.user,
                                });
                            }
                        },
                    },
                    'subscriptions-transport-ws': {
                        onConnect: async (connectionParams: any, webSocket, context) => {
                            const token = connectionParams.Authorization.split(' ')[1];
                            if (token) {
                                const user = await authService.verifyToken(token);
                                if (user) {
                                    usersService.connectedUsers.push(user);
                                    pubSub.publish('userConnected', { userConnected: user });
                                    context.req = {
                                        user: {
                                            ...user,
                                        },
                                    };
                                }
                            }
                            return context;
                        },
                        onDisconnect: ({ context }) => {
                            if (context.req?.user) {
                                usersService.connectedUsers = usersService.connectedUsers.filter(
                                    (user) => user.id !== context.req.user.id
                                );
                                pubSub.publish('connectedUser', {
                                    connectedUser: context.req.user,
                                });
                            }
                        },
                    },
                },
                context: async ({ extra }) => {
                    return extra;
                },
                plugins: [setHttpPlugin, ...protection.plugins],
                validationRules: [...protection.validationRules],
            }),
            // inject: AuthService
            inject: [AuthService, UsersService, 'PUB_SUB'],
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
                synchronize: false,
                charset: 'utf8mb4',
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        PubSubModule,
        // MessagesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}

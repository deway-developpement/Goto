import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Global()
@Module({
    providers: [
        {
            provide: 'PUB_SUB',
            useClass: PubSub,
            useValue: new PubSub(),
        },
    ],
    exports: ['PUB_SUB'],
})
export class PubSubModule {}

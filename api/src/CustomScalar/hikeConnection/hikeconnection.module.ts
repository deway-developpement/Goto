import { Module } from '@nestjs/common';
import { HikeConnectionResolver } from './hikeconnection.resolver';

@Module({
    providers: [HikeConnectionResolver],
})
export class HikeConnectionModule {}

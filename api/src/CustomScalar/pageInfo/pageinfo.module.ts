import { Module } from '@nestjs/common';
import { PageInfoResolver } from './pageinfo.resolver';

@Module({
    providers: [PageInfoResolver],
})
export class PageInfoModule {}

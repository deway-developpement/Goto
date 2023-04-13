import { registerEnumType } from '@nestjs/graphql';

export enum AlertType {
    TRACK_CHANGE = 'trackChange',
    BLOCKED_PATH = 'trackBlocked',
    DANGER = 'danger',
    ANIMAL = 'animal',
    SLIPPERY_PATH = 'slipperyPath',
    DANGEROUS_ROAD = 'dangerousRoad',
    FLOOD = 'flood',
}

registerEnumType(AlertType, {
    name: 'AlertType',
});

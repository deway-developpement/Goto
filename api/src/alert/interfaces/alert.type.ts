import { registerEnumType } from '@nestjs/graphql';

export enum AlertType {
    TRACK_CHANGE,
    BLOCKED_PATH,
    DANGER,
    ANIMAL,
    SLIPPERY_PATH,
    DANGEROUS_ROAD,
    FLOOD,
}

registerEnumType(AlertType, {
    name: 'AlertType',
});

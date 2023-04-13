import { registerEnumType } from '@nestjs/graphql';

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

registerEnumType(Difficulty, {
    name: 'Difficulty',
});

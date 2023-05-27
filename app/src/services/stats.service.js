const WEIGHT = 70;

export function getCalorie(distance, elevation, duration, difficulty) {
    difficulty = difficulty2Factor(difficulty);
    const MET =
        1.32 * (distance / duration) -
        2.23 +
        (1.75 * difficulty - 1.75) +
        (elevation / (distance * 10)) * 0.32;
    const calByMin = (MET * WEIGHT * 3.5) / 200;
    const min = duration * 60;
    return Math.round(calByMin * min + Number.EPSILON);
}

export function difficulty2Factor(difficulty) {
    switch (difficulty) {
    case 'easy':
        return 1;
    case 'medium':
        return 2;
    case 'hard':
        return 3;
    default:
        return 1;
    }
}

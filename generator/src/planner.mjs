import { axisOrder, normalizeWeights } from './profile.mjs';

const difficultyDurationFactor = {
  easy: 1,
  medium: 1.05,
  hard: 1.1,
};

export function planGeneration(profile, requestedCount = profile.targetCount) {
  const totalCount = Number(requestedCount);
  if (!Number.isInteger(totalCount) || totalCount <= 0) {
    throw new Error('The requested count must be a positive integer.');
  }

  const normalizedAxes = {};
  const axisCounts = {};
  const axisSequences = {};

  for (let index = 0; index < axisOrder.length; index += 1) {
    const axisKey = axisOrder[index];
    normalizedAxes[axisKey] = normalizeWeights(profile.quotas[axisKey]);
    axisCounts[axisKey] = allocateWeightedCounts(normalizedAxes[axisKey], totalCount);
    axisSequences[axisKey] = buildAxisSequence(
      normalizedAxes[axisKey],
      axisCounts[axisKey],
      hashSeed(`${profile.location.label}:${axisKey}:${totalCount}:${index}`)
    );
  }

  const slots = [];
  for (let slotIndex = 0; slotIndex < totalCount; slotIndex += 1) {
    const distanceBucket = axisSequences.distanceBuckets[slotIndex];
    const difficulty = axisSequences.difficulties[slotIndex];
    const routeType = axisSequences.routeTypes[slotIndex];
    const terrainProfile = axisSequences.terrainProfiles[slotIndex];
    const experienceTheme = axisSequences.experienceThemes[slotIndex];

    const poiCount = rangeValue(distanceBucket.poiCountRange, slotIndex + 3);
    const routePointCount = rangeValue(distanceBucket.routePointRange, slotIndex + 11);
    const targetDistanceKm = rangeFloat(distanceBucket.minKm, distanceBucket.maxKm, slotIndex + 17, 1);
    const targetElevationGainM = estimateElevationGain(
      targetDistanceKm,
      difficulty,
      terrainProfile,
      slotIndex
    );
    const targetDurationHours = estimateDuration(
      targetDistanceKm,
      targetElevationGainM,
      difficulty.key
    );

    slots.push({
      slotId: `hike-${String(slotIndex + 1).padStart(5, '0')}`,
      batchIndex: Math.floor(slotIndex / profile.batchSize),
      batchSlotIndex: slotIndex % profile.batchSize,
      distanceBucket,
      difficulty,
      routeType,
      terrainProfile,
      experienceTheme,
      targetDistanceKm,
      targetElevationGainM,
      targetDurationHours,
      targetPoiCount: poiCount,
      targetRoutePointCount: routePointCount,
      promptLabel: [
        terrainProfile.label,
        distanceBucket.label,
        difficulty.label,
        experienceTheme.label,
      ].join(' | '),
    });
  }

  return {
    totalCount,
    batchSize: profile.batchSize,
    batchCount: Math.ceil(totalCount / profile.batchSize),
    axisCounts,
    slots,
  };
}

export function allocateWeightedCounts(items, totalCount) {
  const rawCounts = items.map((item) => ({
    key: item.key,
    exact: item.weight * totalCount,
    floor: Math.floor(item.weight * totalCount),
    remainder: item.weight * totalCount - Math.floor(item.weight * totalCount),
  }));

  let assigned = rawCounts.reduce((sum, item) => sum + item.floor, 0);
  const remaining = totalCount - assigned;

  rawCounts
    .slice()
    .sort((left, right) => right.remainder - left.remainder)
    .slice(0, remaining)
    .forEach((item) => {
      const target = rawCounts.find((candidate) => candidate.key === item.key);
      target.floor += 1;
      assigned += 1;
    });

  if (assigned !== totalCount) {
    throw new Error(`Could not allocate the requested total count. Expected ${totalCount}, got ${assigned}.`);
  }

  return Object.fromEntries(rawCounts.map((item) => [item.key, item.floor]));
}

function buildAxisSequence(items, counts, seed) {
  const expanded = [];
  for (const item of items) {
    for (let index = 0; index < counts[item.key]; index += 1) {
      expanded.push(item);
    }
  }

  return deterministicShuffle(expanded, seed);
}

function estimateElevationGain(distanceKm, difficulty, terrainProfile, slotIndex) {
  const baseGain = distanceKm * 70;
  const relief = terrainProfile.reliefMultiplier ?? 1;
  const difficultyFactor = difficulty.elevationMultiplier ?? 1;
  const variability = 0.9 + pseudoRandom(slotIndex + 29) * 0.25;
  return roundToInt(baseGain * relief * difficultyFactor * variability);
}

function estimateDuration(distanceKm, elevationGainM, difficultyKey) {
  const walkHours = distanceKm / 4;
  const climbHours = elevationGainM / 500;
  const movingTime = Math.max(walkHours, climbHours) + Math.min(walkHours, climbHours) * 0.5;
  const duration = movingTime * difficultyDurationFactor[difficultyKey] + movingTime * 0.1;
  return Number((Math.round(duration * 2) / 2).toFixed(1));
}

function rangeValue([min, max], seed) {
  return Math.round(min + (max - min) * pseudoRandom(seed));
}

function rangeFloat(min, max, seed, precision = 1) {
  const factor = 10 ** precision;
  return Math.round((min + (max - min) * pseudoRandom(seed)) * factor) / factor;
}

function deterministicShuffle(items, seed) {
  const shuffled = [...items];
  let state = seed;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = lcg(state);
    const swapIndex = state % (index + 1);
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

function pseudoRandom(seed) {
  const normalized = Math.abs(Math.sin(seed * 12.9898) * 43758.5453);
  return normalized - Math.floor(normalized);
}

function hashSeed(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function lcg(state) {
  return (Math.imul(state, 1664525) + 1013904223) >>> 0;
}

function roundToInt(value) {
  return Math.max(50, Math.round(value));
}

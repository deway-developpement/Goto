import { readFileSync } from 'node:fs';

export const axisOrder = [
  'distanceBuckets',
  'difficulties',
  'routeTypes',
  'terrainProfiles',
  'experienceThemes',
];

export const defaultGenerationProfile = {
  targetCount: 20000,
  batchSize: 24,
  maxRetriesPerSlot: 4,
  location: {
    label: 'Annecy Basin, France',
    centerLatitude: 45.8992,
    centerLongitude: 6.1294,
    radiusKm: 55,
  },
  quotas: {
    distanceBuckets: [
      {
        key: 'short_escape',
        label: 'short escape',
        weight: 0.18,
        minKm: 4.5,
        maxKm: 7.5,
        poiCountRange: [2, 4],
        routePointRange: [80, 120],
        prompt: 'Design a compact hike with a fast payoff and minimal dead time.',
      },
      {
        key: 'classic_half_day',
        label: 'classic half-day',
        weight: 0.34,
        minKm: 7.5,
        maxKm: 12,
        poiCountRange: [3, 5],
        routePointRange: [120, 180],
        prompt: 'Design a balanced hike that feels complete and highly reusable for a broad audience.',
      },
      {
        key: 'big_day',
        label: 'big day',
        weight: 0.3,
        minKm: 12,
        maxKm: 18,
        poiCountRange: [4, 6],
        routePointRange: [180, 240],
        prompt: 'Design a substantial hike with changing scenery, pacing variation, and strong narrative flow.',
      },
      {
        key: 'epic_push',
        label: 'epic push',
        weight: 0.18,
        minKm: 18,
        maxKm: 28,
        poiCountRange: [5, 8],
        routePointRange: [220, 320],
        prompt: 'Design a demanding all-day route that still feels coherent, safe, and editorially valuable.',
      },
    ],
    difficulties: [
      {
        key: 'easy',
        label: 'easy',
        weight: 0.28,
        prompt: 'Keep gradients moderate, navigation clear, and risk exposure low.',
        elevationMultiplier: 0.75,
      },
      {
        key: 'medium',
        label: 'medium',
        weight: 0.47,
        prompt: 'Allow sustained climbs and occasional technical texture without making the route specialist-only.',
        elevationMultiplier: 1,
      },
      {
        key: 'hard',
        label: 'hard',
        weight: 0.25,
        prompt: 'Allow demanding elevation, route commitment, and sharper terrain, but keep the route plausible for hiking.',
        elevationMultiplier: 1.35,
      },
    ],
    routeTypes: [
      {
        key: 'loop',
        label: 'loop',
        weight: 0.48,
        prompt: 'Favor a satisfying loop with distinct outbound and return segments.',
      },
      {
        key: 'out_and_back',
        label: 'out-and-back',
        weight: 0.18,
        prompt: 'Use an out-and-back only when a clear focal point justifies the return.',
      },
      {
        key: 'lollipop',
        label: 'lollipop',
        weight: 0.2,
        prompt: 'Use an approach stem that opens into a scenic circuit.',
      },
      {
        key: 'point_to_point',
        label: 'point-to-point',
        weight: 0.14,
        prompt: 'Use a point-to-point route only if the geography makes it feel premium and purposeful.',
      },
    ],
    terrainProfiles: [
      {
        key: 'forest_ridge',
        label: 'forest ridge',
        weight: 0.2,
        prompt: 'Blend woodland progression with exposed viewpoints and a strong summit or belvedere moment.',
        reliefMultiplier: 1.05,
        categoryHint: 'panoramic ridge hike',
      },
      {
        key: 'lake_valley',
        label: 'lake valley',
        weight: 0.18,
        prompt: 'Use water, open meadows, and gentle valley transitions as the main experiential driver.',
        reliefMultiplier: 0.85,
        categoryHint: 'waterside scenic hike',
      },
      {
        key: 'waterfall_canyon',
        label: 'waterfall canyon',
        weight: 0.14,
        prompt: 'Center the route on moving water, narrow terrain, cool microclimates, and varied rock texture.',
        reliefMultiplier: 1.1,
        categoryHint: 'waterfall exploration hike',
      },
      {
        key: 'alpine_meadow',
        label: 'alpine meadow',
        weight: 0.18,
        prompt: 'Make the route feel open, spacious, floral, and seasonally vivid.',
        reliefMultiplier: 0.95,
        categoryHint: 'high meadow hike',
      },
      {
        key: 'heritage_path',
        label: 'heritage path',
        weight: 0.12,
        prompt: 'Include traces of local culture, old paths, pastoral history, or small built landmarks.',
        reliefMultiplier: 0.8,
        categoryHint: 'heritage trail',
      },
      {
        key: 'rocky_summit',
        label: 'rocky summit',
        weight: 0.18,
        prompt: 'Aim for a bold mountain identity, sharper skyline moments, and a memorable climax.',
        reliefMultiplier: 1.2,
        categoryHint: 'summit objective hike',
      },
    ],
    experienceThemes: [
      {
        key: 'family_friendly',
        label: 'family-friendly',
        weight: 0.14,
        prompt: 'Prioritize accessibility, rest spots, easy landmarks, and a reassuring rhythm.',
      },
      {
        key: 'panoramic',
        label: 'panoramic',
        weight: 0.22,
        prompt: 'Prioritize visual payoff, skyline openings, and multiple standout viewpoints.',
      },
      {
        key: 'wildlife',
        label: 'wildlife',
        weight: 0.14,
        prompt: 'Build in habitat cues, quiet sections, dawn or dusk plausibility, and low-disturbance pacing.',
      },
      {
        key: 'heritage',
        label: 'heritage',
        weight: 0.12,
        prompt: 'Prioritize local history, ruins, chapels, shepherd traces, or traditional landscape use.',
      },
      {
        key: 'training',
        label: 'training',
        weight: 0.18,
        prompt: 'Make the route feel physically rewarding, rhythmically clean, and useful for repeat effort.',
      },
      {
        key: 'solitude',
        label: 'solitude',
        weight: 0.1,
        prompt: 'Favor quieter terrain, psychological spaciousness, and less obvious attraction clusters.',
      },
      {
        key: 'water_discovery',
        label: 'water discovery',
        weight: 0.1,
        prompt: 'Use lakes, streams, springs, and cascades as the emotional thread of the hike.',
      },
    ],
  },
  promptDirectives: {
    brandVoice:
      'Write like a careful route designer producing premium hiking inventory for a real consumer product.',
    antiDuplication:
      'Every route must feel distinct in geometry, mood, route logic, landmark mix, and narrative positioning.',
    qualityRules:
      'Reject generic filler. Prefer concrete terrain logic, plausible pacing, consistent coordinates, and realistic distances.',
    extraSafetyRules:
      'Do not invent via ferrata, glacier travel, rope work, or legal access through private property.',
  },
};

export function loadGenerationProfile(profileFilePath) {
  const baseProfile = clone(defaultGenerationProfile);
  if (!profileFilePath) {
    return baseProfile;
  }

  const overrides = JSON.parse(readFileSync(profileFilePath, 'utf8'));
  return mergeProfile(baseProfile, overrides);
}

export function mergeProfile(baseProfile, overrides = {}) {
  const profile = clone(baseProfile);

  if (overrides.location) {
    Object.assign(profile.location, overrides.location);
  }

  if (typeof overrides.targetCount === 'number') {
    profile.targetCount = overrides.targetCount;
  }

  if (typeof overrides.batchSize === 'number') {
    profile.batchSize = overrides.batchSize;
  }

  if (typeof overrides.maxRetriesPerSlot === 'number') {
    profile.maxRetriesPerSlot = overrides.maxRetriesPerSlot;
  }

  if (overrides.promptOverrides) {
    profile.promptDirectives = {
      ...profile.promptDirectives,
      ...overrides.promptOverrides,
    };
  }

  if (overrides.quotaOverrides) {
    for (const axisKey of axisOrder) {
      if (!overrides.quotaOverrides[axisKey]) {
        continue;
      }

      const axisItems = profile.quotas[axisKey].map((item) => {
        const overrideWeight = overrides.quotaOverrides[axisKey][item.key];
        return {
          ...item,
          weight: typeof overrideWeight === 'number' ? overrideWeight : item.weight,
        };
      });

      profile.quotas[axisKey] = normalizeWeights(axisItems);
    }
  }

  return profile;
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeWeights(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    throw new Error('Quota weights must sum to a positive number.');
  }

  return items.map((item) => ({
    ...item,
    weight: item.weight / totalWeight,
  }));
}

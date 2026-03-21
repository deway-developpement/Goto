export function buildGeneratorPrompt(profile, slot, options = {}) {
  const feedbackBlock = options.feedback
    ? `Previous rejection feedback for this slot:\n${options.feedback.trim()}`
    : 'Previous rejection feedback for this slot: none. Treat this as a fresh generation.';

  const duplicateBlock =
    options.recentAcceptedSignatures && options.recentAcceptedSignatures.length > 0
      ? `Recent accepted hike signatures to avoid duplicating:\n${options.recentAcceptedSignatures
          .map((signature, index) => `${index + 1}. ${signature}`)
          .join('\n')}`
      : 'Recent accepted hike signatures to avoid duplicating: none supplied.';

  return `You are generating premium hiking inventory for a production dataset.

Objective:
- Produce exactly one structured hike candidate for slot ${slot.slotId}.
- The route must fit the global location "${profile.location.label}" centered near ${profile.location.centerLatitude}, ${profile.location.centerLongitude} within a ${profile.location.radiusKm} km radius.
- Optimize for novelty, internal consistency, and strong consumer-facing value.

Quota context for this slot:
- Distance bucket: ${slot.distanceBucket.label} (${slot.distanceBucket.minKm}-${slot.distanceBucket.maxKm} km)
- Difficulty: ${slot.difficulty.label}
- Route type: ${slot.routeType.label}
- Terrain profile: ${slot.terrainProfile.label}
- Experience theme: ${slot.experienceTheme.label}

Hard generation guidance:
- ${slot.distanceBucket.prompt}
- ${slot.difficulty.prompt}
- ${slot.routeType.prompt}
- ${slot.terrainProfile.prompt}
- ${slot.experienceTheme.prompt}
- ${profile.promptDirectives.brandVoice}
- ${profile.promptDirectives.antiDuplication}
- ${profile.promptDirectives.qualityRules}
- ${profile.promptDirectives.extraSafetyRules}

Numerical targets:
- target_distance_km: ${slot.targetDistanceKm}
- target_elevation_gain_m: ${slot.targetElevationGainM}
- target_duration_hours: ${slot.targetDurationHours}
- target_poi_count: ${slot.targetPoiCount}
- target_route_point_count: ${slot.targetRoutePointCount}

Consistency rules:
- Keep distance_km within +/- 8 percent of target_distance_km.
- Keep elevation_gain_m within +/- 15 percent of target_elevation_gain_m.
- Keep estimated_duration_hours within +/- 0.5 hour of target_duration_hours unless terrain logic clearly requires a different value.
- Every POI must be within 250 meters of at least one route point.
- Route points must create a plausible continuous hike with no teleport jumps, no impossible crossings, and no repeated oscillation.
- Keep start and end points plausible for the route type.
- Do not create legendary or world-famous landmarks unless they genuinely fit the supplied area.
- Avoid placeholder names, filler descriptions, and generic "beautiful view" writing.

${duplicateBlock}

${feedbackBlock}

Return raw JSON only with this exact shape:
{
  "slot_id": "${slot.slotId}",
  "source_location": {
    "label": "${profile.location.label}",
    "center_latitude": ${profile.location.centerLatitude},
    "center_longitude": ${profile.location.centerLongitude},
    "radius_km": ${profile.location.radiusKm}
  },
  "hike": {
    "name": "string",
    "description_short": "string",
    "description_long": "string",
    "difficulty": "${slot.difficulty.key}",
    "distance_km": ${slot.targetDistanceKm},
    "elevation_gain_m": ${slot.targetElevationGainM},
    "estimated_duration_hours": ${slot.targetDurationHours},
    "route_type": "${slot.routeType.key}",
    "terrain_profile": "${slot.terrainProfile.key}",
    "experience_theme": "${slot.experienceTheme.key}",
    "category_hint": "${slot.terrainProfile.categoryHint}",
    "best_seasons": ["spring", "summer"],
    "safety_notes": ["string"],
    "tags": ["string"],
    "start_point": {
      "latitude": 0,
      "longitude": 0,
      "name": "string"
    },
    "end_point": {
      "latitude": 0,
      "longitude": 0,
      "name": "string"
    },
    "bounding_box": {
      "north": 0,
      "south": 0,
      "east": 0,
      "west": 0
    }
  },
  "points_of_interest": [
    {
      "name": "string",
      "type": "viewpoint | waterfall | lake | refuge | heritage | geology | wildlife | forest | meadow | summit | spring | chapel | bridge | village",
      "description": "string",
      "latitude": 0,
      "longitude": 0,
      "stay_duration_min": 0,
      "why_it_matters": "string"
    }
  ],
  "route_points": [
    {
      "latitude": 0,
      "longitude": 0,
      "elevation_m": 0,
      "segment_note": "string"
    }
  ],
  "quality_notes": {
    "novelty_explanation": "string",
    "quota_rationale": "string",
    "uncertainty_flags": []
  }
}

Important:
- Output valid JSON only.
- Do not wrap the JSON in Markdown.
- Do not omit fields.
- Use exactly ${slot.targetPoiCount} POIs.
- Use between ${Math.max(40, slot.targetRoutePointCount - 10)} and ${slot.targetRoutePointCount + 10} route points.
- Keep the candidate clearly distinct from previously accepted routes.`;
}

export function buildJudgePrompt(profile, plannedSlots, candidateBatch, options = {}) {
  const feedbackPolicy =
    options.feedbackPolicy ??
    `Reject anything duplicated, under-specified, geographically implausible, or quota-breaking.`;

  const batchJson = candidateBatch
    ? JSON.stringify(candidateBatch, null, 2)
    : '"CANDIDATE_BATCH_JSON_GOES_HERE"';

  return `You are the batch judge for a synthetic hiking dataset.

Goal:
- Review one generation batch for quality, novelty, schema compliance, and quota alignment.
- Accept only records that are production-credible.
- Reject weak or duplicated records and produce precise retry guidance.

Global location:
- ${profile.location.label}
- center: ${profile.location.centerLatitude}, ${profile.location.centerLongitude}
- radius: ${profile.location.radiusKm} km

Judging priorities:
- no duplicate or near-duplicate hikes within the batch,
- no duplicate or near-duplicate hikes against previously accepted inventory when provided,
- no weird values for distance, elevation, duration, coordinates, POI counts, or route geometry,
- no mismatch between route type, terrain profile, difficulty, and narrative description,
- no generic naming or repeated landmark patterns,
- no broken schema or missing fields,
- strong spread across the planned quotas.

${feedbackPolicy}

Planned slot expectations:
${plannedSlots
  .map(
    (slot) =>
      `- ${slot.slotId}: ${slot.distanceBucket.key}, ${slot.difficulty.key}, ${slot.routeType.key}, ${slot.terrainProfile.key}, ${slot.experienceTheme.key}, target ${slot.targetDistanceKm} km, ${slot.targetElevationGainM} m gain, ${slot.targetPoiCount} POIs`
  )
  .join('\n')}

Candidate batch JSON:
${batchJson}

Return raw JSON only:
{
  "accepted_slot_ids": ["string"],
  "rejected": [
    {
      "slot_id": "string",
      "reasons": ["string"],
      "severity": "low | medium | high",
      "retry_guidance": "string"
    }
  ],
  "batch_feedback": {
    "summary": "string",
    "quota_risks": ["string"],
    "duplication_risks": ["string"],
    "next_batch_advice": ["string"]
  }
}

Be strict. Prefer rejection over accepting weak data.`;
}

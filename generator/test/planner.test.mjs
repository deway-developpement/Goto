import test from 'node:test';
import assert from 'node:assert/strict';
import { planGeneration } from '../src/planner.mjs';
import { defaultGenerationProfile } from '../src/profile.mjs';

test('planGeneration allocates the exact requested slot count', () => {
  const plan = planGeneration(defaultGenerationProfile, 37);

  assert.equal(plan.totalCount, 37);
  assert.equal(plan.slots.length, 37);
  assert.equal(
    Object.values(plan.axisCounts.distanceBuckets).reduce((sum, value) => sum + value, 0),
    37
  );
  assert.equal(
    Object.values(plan.axisCounts.difficulties).reduce((sum, value) => sum + value, 0),
    37
  );
});

test('planGeneration produces stable slot metadata', () => {
  const plan = planGeneration(defaultGenerationProfile, 5);

  assert.equal(plan.slots[0].slotId, 'hike-00001');
  assert.ok(plan.slots[0].targetDistanceKm >= 4.5);
  assert.ok(plan.slots[0].targetPoiCount >= 2);
  assert.ok(plan.slots[0].targetRoutePointCount >= 80);
});

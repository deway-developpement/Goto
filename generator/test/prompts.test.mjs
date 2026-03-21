import test from 'node:test';
import assert from 'node:assert/strict';
import { planGeneration } from '../src/planner.mjs';
import { buildGeneratorPrompt, buildJudgePrompt } from '../src/prompts.mjs';
import { defaultGenerationProfile } from '../src/profile.mjs';

test('generator prompt includes slot-specific constraints', () => {
  const plan = planGeneration(defaultGenerationProfile, 3);
  const prompt = buildGeneratorPrompt(defaultGenerationProfile, plan.slots[1], {
    feedback: 'Avoid repeating the same lakeside viewpoint structure.',
    recentAcceptedSignatures: ['Loop with chapel, ridge opening, and lake finish'],
  });

  assert.match(prompt, /slot hike-00002/);
  assert.match(prompt, /Avoid repeating the same lakeside viewpoint structure/);
  assert.match(prompt, /Recent accepted hike signatures/);
});

test('judge prompt includes planned slot expectations', () => {
  const plan = planGeneration(defaultGenerationProfile, 6);
  const prompt = buildJudgePrompt(defaultGenerationProfile, plan.slots.slice(0, 3), null);

  assert.match(prompt, /batch judge/);
  assert.match(prompt, /hike-00001/);
  assert.match(prompt, /CANDIDATE_BATCH_JSON_GOES_HERE/);
});

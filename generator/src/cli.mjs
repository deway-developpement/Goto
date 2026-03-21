import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { generateJsonWithOllama } from './providers/ollama.mjs';
import { buildGeneratorPrompt, buildJudgePrompt } from './prompts.mjs';
import { planGeneration } from './planner.mjs';
import { loadGenerationProfile } from './profile.mjs';

const args = parseArgs(process.argv.slice(2));
const command = args._[0] ?? 'plan';
const ollamaHost = String(args.host ?? process.env.OLLAMA_HOST ?? 'http://127.0.0.1:11434');
const ollamaModel = args.model ? String(args.model) : process.env.OLLAMA_MODEL;

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  const profile = loadGenerationProfile(args['profile-file']);
  applyInlineOverrides(profile, args);
  const plan = planGeneration(profile, args.count ? Number(args.count) : profile.targetCount);

  if (command === 'plan') {
    printPlan(profile, plan);
  } else if (command === 'prompt') {
    const slotIndex = Number(args.slot ?? 0);
    const slot = plan.slots[slotIndex];
    if (!slot) {
      throw new Error(`Unknown slot index ${slotIndex}.`);
    }

    const signatures = args['recent-signatures']
      ? String(args['recent-signatures'])
          .split('|')
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    console.log(
      buildGeneratorPrompt(profile, slot, {
        feedback: args.feedback ? String(args.feedback) : '',
        recentAcceptedSignatures: signatures,
      })
    );
  } else if (command === 'judge') {
    const batchIndex = Number(args.batch ?? 0);
    const start = batchIndex * plan.batchSize;
    const plannedSlots = plan.slots.slice(start, start + plan.batchSize);
    if (plannedSlots.length === 0) {
      throw new Error(`Unknown batch index ${batchIndex}.`);
    }

    const candidateBatch = args['candidate-file']
      ? JSON.parse(readFileSync(args['candidate-file'], 'utf8'))
      : null;

    console.log(buildJudgePrompt(profile, plannedSlots, candidateBatch));
  } else if (command === 'ollama-generate') {
    ensureOllamaModel(ollamaModel);
    const slotIndex = Number(args.slot ?? 0);
    const slot = plan.slots[slotIndex];
    if (!slot) {
      throw new Error(`Unknown slot index ${slotIndex}.`);
    }

    const signatures = args['recent-signatures']
      ? String(args['recent-signatures'])
          .split('|')
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    const prompt = buildGeneratorPrompt(profile, slot, {
      feedback: args.feedback ? String(args.feedback) : '',
      recentAcceptedSignatures: signatures,
    });

    const result = await generateJsonWithOllama({
      host: ollamaHost,
      model: ollamaModel,
      prompt,
      system: 'Return valid JSON only. Do not use Markdown fences.',
      keepAlive: String(args['keep-alive'] ?? '5m'),
    });

    const printable = {
      host: ollamaHost,
      model: ollamaModel,
      slotId: slot.slotId,
      batchIndex: slot.batchIndex,
      promptLabel: slot.promptLabel,
      parsed: result.parsed,
      metrics: pickOllamaMetrics(result.payload),
    };

    await maybeWriteOutput(args.output, printable);
    console.log(JSON.stringify(printable, null, 2));
  } else if (command === 'ollama-judge') {
    ensureOllamaModel(ollamaModel);
    if (!args['candidate-file']) {
      throw new Error('The ollama-judge command requires --candidate-file.');
    }

    const batchIndex = Number(args.batch ?? 0);
    const start = batchIndex * plan.batchSize;
    const plannedSlots = plan.slots.slice(start, start + plan.batchSize);
    if (plannedSlots.length === 0) {
      throw new Error(`Unknown batch index ${batchIndex}.`);
    }

    const candidateBatch = JSON.parse(readFileSync(args['candidate-file'], 'utf8'));
    const prompt = buildJudgePrompt(profile, plannedSlots, candidateBatch);
    const result = await generateJsonWithOllama({
      host: ollamaHost,
      model: ollamaModel,
      prompt,
      system: 'Return valid JSON only. Be strict and concise.',
      keepAlive: String(args['keep-alive'] ?? '5m'),
    });

    const printable = {
      host: ollamaHost,
      model: ollamaModel,
      batchIndex,
      parsed: result.parsed,
      metrics: pickOllamaMetrics(result.payload),
    };

    await maybeWriteOutput(args.output, printable);
    console.log(JSON.stringify(printable, null, 2));
  } else {
    throw new Error(
      `Unknown command "${command}". Use plan, prompt, judge, ollama-generate, or ollama-judge.`
    );
  }
}

function printPlan(profile, plan) {
  const previewSlots = plan.slots.slice(0, Math.min(plan.batchSize, 8));
  const printable = {
    location: profile.location,
    totalCount: plan.totalCount,
    batchSize: plan.batchSize,
    batchCount: plan.batchCount,
    quotas: plan.axisCounts,
    preview: previewSlots.map((slot) => ({
      slotId: slot.slotId,
      batchIndex: slot.batchIndex,
      promptLabel: slot.promptLabel,
      targetDistanceKm: slot.targetDistanceKm,
      targetElevationGainM: slot.targetElevationGainM,
      targetDurationHours: slot.targetDurationHours,
      targetPoiCount: slot.targetPoiCount,
      targetRoutePointCount: slot.targetRoutePointCount,
    })),
  };

  console.log(JSON.stringify(printable, null, 2));
}

function applyInlineOverrides(profile, args) {
  if (args.location) {
    profile.location.label = String(args.location);
  }

  if (args.lat) {
    profile.location.centerLatitude = Number(args.lat);
  }

  if (args.lng) {
    profile.location.centerLongitude = Number(args.lng);
  }

  if (args.radius) {
    profile.location.radiusKm = Number(args.radius);
  }

  if (args['batch-size']) {
    profile.batchSize = Number(args['batch-size']);
  }
}

function parseArgs(argv) {
  const parsed = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      parsed._.push(token);
      continue;
    }

    const key = token.slice(2);
    const nextToken = argv[index + 1];
    if (!nextToken || nextToken.startsWith('--')) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = nextToken;
    index += 1;
  }

  return parsed;
}

function ensureOllamaModel(model) {
  if (!model) {
    throw new Error('Provide --model or set OLLAMA_MODEL before calling Ollama.');
  }
}

function pickOllamaMetrics(payload) {
  return {
    totalDuration: payload.total_duration,
    loadDuration: payload.load_duration,
    promptEvalCount: payload.prompt_eval_count,
    evalCount: payload.eval_count,
    doneReason: payload.done_reason,
  };
}

async function maybeWriteOutput(outputPath, value) {
  if (!outputPath) {
    return;
  }

  await writeFile(String(outputPath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

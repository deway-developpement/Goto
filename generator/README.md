# Goto Data Generator

This package plans high-volume hike generation before any model call is made. It hardcodes:

- quota distributions for distance, difficulty, route type, terrain, and experience theme,
- detailed generator prompts with per-slot constraints,
- a judge prompt template for batch review and retry feedback,
- a local Ollama adapter for trying generator or judge prompts against a local model.

## Commands

```bash
cd generator
npm run plan -- --count 48 --location "Annecy Basin, France" --lat 45.8992 --lng 6.1294
npm run prompt -- --slot 3 --location "Annecy Basin, France"
npm run judge -- --batch 0 --candidate-file ./fixtures/batch-0.json
npm run ollama:generate -- --model qwen2.5:14b --slot 0 --location "Annecy Basin, France"
npm run ollama:judge -- --model qwen2.5:14b --batch 0 --candidate-file ./fixtures/batch-0.json
npm test
```

## Customization

You can override the default profile with a JSON file:

```bash
cd generator
npm run plan -- --profile-file ./profile.example.json
```

`profile.example.json` can override:

- `location`
- `targetCount`
- `batchSize`
- `quotaOverrides`
- `promptOverrides`

## Ollama

The local adapter calls Ollama's local API at `http://127.0.0.1:11434` by default. Override it with `--host` or `OLLAMA_HOST`.

- `ollama:generate` sends one planned slot to a local Ollama model and prints parsed JSON plus response metrics.
- `ollama:judge` sends one candidate batch plus slot expectations to a local Ollama model and prints the parsed judge result.

Use either `--model your-model` or set `OLLAMA_MODEL`. You can also persist results with `--output ./tmp/result.json`.

The generator prompt asks for structured `route_points` rather than raw GPX XML. That is intentional: a downstream exporter can render deterministic GPX files from validated coordinates, which is more reliable than asking a model to emit large XML blobs directly.

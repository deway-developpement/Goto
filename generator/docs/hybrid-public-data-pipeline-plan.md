# Hybrid Public-Data Generator Plan

This plan defines a fully autonomous, cache-backed, parallelizable data generation pipeline that stays entirely inside `generator/`. It prioritizes France as the richest initial dataset while remaining global by design, and it uses only public-license or explicitly reusable sources for routes, elevation, and images.

## Goals

- Build a large hike dataset from real public data rather than hallucinated routes.
- Keep `crawler`, `llm-generator`, `judge`, and `publisher` as independent modules so they can run in parallel.
- Use a local cache database to avoid redownloading, reprocessing, or rejudging the same records.
- Publish records without illustrations when no compliant image exists, then backfill later.
- Support global coverage with France as the primary high-quality ingestion target.

## Hard Constraints

- All implementation lives under `generator/`.
- No dependency on `app/` or `api/` folders.
- No crawling of proprietary hiking platforms without explicit permission.
- No synthetic route geometry from the LLM.
- No generated “real” images when source images are missing.
- No image licenses that could block future commercial use.

## Provider Policy

### Approved route and geographic data sources

- `OpenStreetMap` data through regional extracts and Overpass queries.
- `Geofabrik` for regional OSM extracts.
- `data.gouv.fr` for French open datasets, especially departmental and regional hiking datasets.
- `IGN` services and datasets where licensing allows downstream reuse.
- `openrouteservice` for route cleanup, elevation fill, and geocoding support when source data is incomplete.

### Approved image sources

- `Wikimedia Commons`.
- `Flickr` only when the license is explicitly compatible with eventual commercial use.

### Allowed image licenses

- `CC0`
- `CC BY`
- `CC BY-SA`
- Public domain equivalents

### Rejected image licenses

- `CC BY-NC`
- `CC BY-ND`
- Any unknown or custom restrictive license

### Publishing rule

- If no compliant real image is found, publish the hike without an illustration and mark it for future backfill.

## Geographic Rollout

### Phase 1 geography

- France nationwide
- Priority within France:
  - Departments with published hiking open data on `data.gouv.fr`
  - IGN-supported territories
  - OSM-rich mountain and park regions

### Phase 2 geography

- Western Europe
- North America
- High-tourism hiking regions worldwide

### Phase 3 geography

- Broad global expansion through OSM-first discovery with country-by-country extract processing

## Target Architecture

The system is split into five independent runtime layers.

1. `crawler`
2. `normalizer`
3. `llm-generator`
4. `judge`
5. `publisher`

The `normalizer` is a deterministic internal stage between crawling and generation. It should remain separate in code, even if invoked by the crawler pipeline, because it owns geometry cleanup and schema conversion.

### Proposed package layout

```text
generator/
  docs/
    hybrid-public-data-pipeline-plan.md
  src/
    cli/
      crawl.mjs
      normalize.mjs
      generate.mjs
      judge.mjs
      publish.mjs
      backfill-images.mjs
    config/
      providers.mjs
      licenses.mjs
      taxonomy.mjs
      thresholds.mjs
    db/
      cache.mjs
      schema.mjs
      migrations/
    crawler/
      runner.mjs
      scheduler.mjs
      dedupe-seeds.mjs
      providers/
        osm-overpass.mjs
        geofabrik.mjs
        data-gouv.mjs
        ign.mjs
        openrouteservice.mjs
        wikimedia-commons.mjs
        flickr.mjs
    normalizer/
      route-normalizer.mjs
      gpx-exporter.mjs
      geometry-cleaner.mjs
      elevation-enricher.mjs
      image-ranker.mjs
      taxonomy-mapper.mjs
    llm-generator/
      runner.mjs
      prompts/
        hike-description.mjs
        tag-inference.mjs
        category-mapping.mjs
        poi-summary.mjs
      providers/
        ollama.mjs
        openai.mjs
      validators/
        output-schema.mjs
    judge/
      runner.mjs
      deterministic/
        route-rules.mjs
        license-rules.mjs
        completeness-rules.mjs
        duplicate-rules.mjs
      llm/
        prompt.mjs
        parser.mjs
      scoring/
        scorecard.mjs
        batch-score.mjs
    publisher/
      runner.mjs
      export/
        jsonl.mjs
        ndjson.mjs
        sqlite-export.mjs
      sinks/
        filesystem.mjs
        mysql.mjs
      manifests/
        attribution-writer.mjs
        publish-report.mjs
    shared/
      logging.mjs
      retry.mjs
      rate-limit.mjs
      hashing.mjs
      geo.mjs
      time.mjs
      ids.mjs
  data/
    cache/
    raw/
    derived/
    exports/
    reports/
```

## Module Boundaries

### `crawler`

Responsibilities:

- Discover source datasets and records.
- Download source metadata and route geometries.
- Collect source images and metadata.
- Store raw payloads and fetch metadata in the local cache.
- Respect provider throttling, retries, and watermarks.

Does not do:

- LLM enrichment
- final quality decisions
- publishing

Parallelization model:

- Parallel by provider
- Parallel by region
- Parallel by dataset page or shard

Inputs:

- provider config
- country or region scope
- fetch watermark
- concurrency budget

Outputs:

- raw route records
- raw media records
- source manifests
- fetch status logs

### `normalizer`

Responsibilities:

- Convert heterogeneous source formats into one canonical route schema.
- Repair geometries and build GPX output.
- Derive centroid, start, end, bounds, distance, and geometry fingerprints.
- Resolve elevation if missing or poor quality.
- Rank and filter image candidates.
- Map source categories into the internal taxonomy draft.

Does not do:

- prose generation
- accept or reject final publication

Parallelization model:

- Parallel by route candidate
- Parallel by source dataset chunk

Outputs:

- normalized route candidates
- normalized media candidates
- derived GPX files
- deterministic quality metrics

### `llm-generator`

Responsibilities:

- Generate short descriptions from source facts.
- Normalize titles to fit product naming constraints.
- Infer tags and categories from deterministic route features plus source metadata.
- Produce optional POI summaries when POIs exist.
- Translate descriptions into target languages if enabled.

Must never generate:

- route geometry
- coordinates
- elevation
- distance
- source attribution
- image provenance
- license values

Parallelization model:

- Parallel by route candidate
- Parallel by enrichment task type

Outputs:

- structured enrichment objects with confidence and unsupported-claim flags

### `judge`

Responsibilities:

- Apply deterministic validation rules.
- Run an LLM review only on candidates that pass baseline structural rules.
- Score candidates individually and in batches.
- Decide `publish`, `quarantine`, `needs-backfill`, or `reject`.

Parallelization model:

- Parallel by candidate batch
- Parallel by rule family

Outputs:

- per-candidate decision
- per-batch health report
- rejection reasons
- retry instructions

### `publisher`

Responsibilities:

- Publish approved records to the selected sink.
- Export attribution manifests and license reports.
- Write batch summaries and publish logs.
- Support dry runs and idempotent republishing.

Parallelization model:

- Parallel by sink
- Parallel by approved shard

Outputs:

- exported dataset files
- sink writes
- publish audit manifest

## Local Cache Database

Use a dedicated SQLite cache database inside `generator/data/cache/ingestion.db`.

Why SQLite:

- local-first
- easy to inspect
- transactional
- cheap resumability
- no external service dependency

### Core tables

#### `crawl_run`

- `id`
- `module`
- `provider`
- `scope_key`
- `started_at`
- `finished_at`
- `status`
- `watermark_in`
- `watermark_out`
- `records_seen`
- `records_inserted`
- `records_updated`
- `error_count`

#### `source_dataset`

- `id`
- `provider`
- `dataset_key`
- `dataset_url`
- `license_code`
- `license_label`
- `attribution_text`
- `country_code`
- `region_code`
- `last_seen_at`
- `etag`
- `checksum`

#### `source_record`

- `id`
- `provider`
- `dataset_id`
- `source_id`
- `source_url`
- `record_type`
- `raw_json_path`
- `raw_hash`
- `license_code`
- `attribution_text`
- `fetched_at`
- `updated_at`
- `status`

#### `route_candidate`

- `id`
- `canonical_key`
- `provider`
- `source_record_id`
- `country_code`
- `region_code`
- `name_raw`
- `name_normalized`
- `geometry_hash`
- `centroid_lat`
- `centroid_lng`
- `start_lat`
- `start_lng`
- `end_lat`
- `end_lng`
- `distance_km`
- `ascent_m`
- `descent_m`
- `min_altitude_m`
- `max_altitude_m`
- `loop_type`
- `surface_guess`
- `route_type`
- `difficulty_raw`
- `difficulty_normalized`
- `gpx_path`
- `completeness_score`
- `publish_state`

#### `media_candidate`

- `id`
- `route_candidate_id`
- `provider`
- `source_id`
- `source_url`
- `file_url`
- `thumbnail_url`
- `license_code`
- `author_name`
- `author_url`
- `attribution_text`
- `width`
- `height`
- `distance_to_route_m`
- `relevance_score`
- `phash`
- `accepted_for_publish`

#### `elevation_profile`

- `id`
- `route_candidate_id`
- `provider`
- `sampling_step_m`
- `point_count`
- `profile_json_path`
- `quality_flag`
- `derived_ascent_m`
- `derived_descent_m`
- `derived_min_m`
- `derived_max_m`

#### `llm_enrichment`

- `id`
- `route_candidate_id`
- `task_type`
- `model_provider`
- `model_name`
- `prompt_version`
- `input_hash`
- `output_json`
- `confidence_score`
- `unsupported_claims_count`
- `status`
- `created_at`

#### `judge_result`

- `id`
- `route_candidate_id`
- `batch_id`
- `deterministic_score`
- `llm_score`
- `final_score`
- `decision`
- `reasons_json`
- `needs_backfill_image`
- `review_priority`
- `created_at`

#### `publish_log`

- `id`
- `route_candidate_id`
- `sink`
- `sink_record_id`
- `published_at`
- `publish_version`
- `status`
- `manifest_path`

#### `dedupe_key`

- `id`
- `entity_type`
- `key_type`
- `key_value`
- `route_candidate_id`

## Canonical Route Schema

Every normalized candidate should conform to one internal schema before LLM or judge steps run.

```json
{
  "id": "uuid",
  "source": {
    "provider": "data-gouv",
    "dataset_id": "string",
    "source_id": "string",
    "source_url": "https://...",
    "license_code": "odbl",
    "attribution_text": "..."
  },
  "geo": {
    "country_code": "FR",
    "region_code": "74",
    "centroid": { "lat": 45.9, "lng": 6.12 },
    "start": { "lat": 45.89, "lng": 6.11 },
    "end": { "lat": 45.89, "lng": 6.11 },
    "bounds": [45.8, 6.0, 46.0, 6.2],
    "route_points": [],
    "gpx_path": "generator/data/derived/gpx/....gpx"
  },
  "metrics": {
    "distance_km": 12.4,
    "ascent_m": 780,
    "descent_m": 780,
    "min_altitude_m": 620,
    "max_altitude_m": 1410,
    "estimated_duration_h": 4.5
  },
  "classification": {
    "route_type": "loop",
    "difficulty": "medium",
    "surface": ["trail", "rock", "forest"],
    "categories": [],
    "tags": []
  },
  "content": {
    "name_raw": "Boucle du Parmelan",
    "name_normalized": "Parmelan Loop",
    "description_source_facts": [],
    "description_generated": null
  },
  "images": [],
  "quality": {
    "completeness_score": 0,
    "flags": []
  }
}
```

## Detailed Pipeline

### Step 1: Dataset discovery

The crawler creates a world coverage plan, but assigns France a higher priority weight.

Discovery inputs:

- country list
- provider list
- region priority weights
- dataset inclusion rules

Discovery logic:

- For France:
  - enumerate `data.gouv.fr` hiking datasets first
  - enrich with IGN-supported metadata
  - backfill uncovered areas using OSM
- For other countries:
  - start with Geofabrik extracts when available
  - use Overpass for targeted discovery in high-value hiking regions

Outputs:

- queue of datasets to fetch
- provider-specific shard list
- watermark state

### Step 2: Raw crawling

For each provider adapter:

- fetch metadata pages
- fetch dataset files or API records
- store raw responses in `generator/data/raw/`
- insert source metadata into SQLite
- compute raw payload hashes
- skip unchanged records

Raw storage convention:

- `generator/data/raw/{provider}/{country}/{dataset_key}/{hash}.json`
- `generator/data/raw/{provider}/{country}/{dataset_key}/{hash}.geojson`
- `generator/data/raw/{provider}/{country}/{dataset_key}/{hash}.xml`

### Step 3: Deterministic normalization

For each raw route record:

- parse the format
- convert geometry to line points
- remove duplicate consecutive points
- detect broken geometries
- split invalid multiparts when necessary
- normalize coordinate precision
- derive centroid, bounds, and route shape metadata
- export deterministic GPX
- compute geometry fingerprint for dedupe

Normalization rejection cases:

- missing geometry
- fewer than minimum route points
- impossible coordinates
- route shorter than configured minimum
- likely urban sidewalk fragment rather than hike

### Step 4: Elevation enrichment

Priority order:

1. embedded elevation from GPX or source route
2. IGN elevation service for France
3. openrouteservice elevation API
4. fallback to no elevation and quarantine if the route still looks valuable

Elevation process:

- sample points along route at fixed spacing
- query elevation source
- smooth extreme spikes
- compute ascent, descent, min, max
- label profile quality:
  - `measured`
  - `sampled-high-confidence`
  - `sampled-low-confidence`
  - `missing`

### Step 5: Image discovery and ranking

Priority order:

1. Wikimedia Commons
2. Flickr with commercially compatible license only

Image search strategies:

- geosearch around centroid
- geosearch around start point
- search using route name plus nearest POI or massif
- search around extracted POIs or peaks

Image ranking features:

- distance to route
- image resolution
- geotag presence
- title relevance
- source quality
- license quality

Image acceptance rule:

- at least one compliant license and full attribution fields present

No-image rule:

- if no compliant image passes ranking, set `needs_backfill_image = true` and continue

### Step 6: LLM enrichment

The `llm-generator` only consumes normalized deterministic facts.

Tasks:

- `title-normalization`
- `description-generation`
- `tag-inference`
- `category-mapping`
- `poi-summary`
- `translation`

Prompt rules:

- force structured JSON outputs
- include factual source fields only
- ban unsupported speculation
- require compact descriptions
- require confidence score per field

Mandatory validator checks:

- schema parse success
- no new numbers not present in deterministic input unless explicitly derived
- no invented image, author, or license information
- title length constraints

### Step 7: Candidate judge

The judge runs in two layers.

#### Layer A: deterministic judge

Checks:

- license validity
- source attribution completeness
- GPX validity
- route point count
- distance bounds
- ascent-to-distance plausibility
- duplicate geometry score
- duplicate name plus centroid proximity
- category/tag coverage
- image compliance
- text completeness

Possible outcomes:

- `pass`
- `quarantine`
- `reject`

#### Layer B: LLM judge

Only runs on deterministic `pass` or borderline `quarantine`.

Checks:

- description fidelity to source facts
- title quality
- category plausibility
- tag usefulness
- likely end-user appeal
- signs of low-information or repetitive content

LLM judge output:

- per-candidate score
- reasons
- retry hints
- recommended action

### Step 8: Batch judge

The judge should also evaluate batches, not only single records.

Batch-level metrics:

- provider distribution
- country distribution
- France coverage ratio
- duplicate rate
- average confidence
- no-image rate
- invalid geometry rate
- too-similar-description rate
- category imbalance
- difficulty imbalance

Batch-level actions:

- allow full publish
- publish subset only
- rerun enrichment for weak clusters
- reject provider shard

### Step 9: Publisher

The publisher reads only approved candidates.

Publish targets should be pluggable:

- filesystem export
- SQLite export
- MySQL sink
- JSONL or NDJSON snapshots

The first implementation should publish to filesystem snapshots and SQLite export before any external sink.

Publisher outputs:

- `generator/data/exports/hikes.jsonl`
- `generator/data/exports/media.jsonl`
- `generator/data/exports/attribution.jsonl`
- `generator/data/reports/publish-summary-{timestamp}.md`

Idempotency rules:

- publish only once per `route_candidate + publish_version + sink`
- allow re-publish after `judge_result` changes

## Dedupe Strategy

Dedupe should happen at multiple levels.

### Route dedupe

Use:

- geometry fingerprint
- centroid proximity
- normalized title similarity
- start/end point proximity
- distance similarity band

### Image dedupe

Use:

- exact file URL
- normalized source ID
- perceptual hash
- author plus title similarity

### Description dedupe

Use:

- text hash
- embedding similarity later if needed
- batch-level repetition threshold

## France-First Policy

When the same area is covered by multiple providers, use this preference order for France:

1. department or regional open datasets from `data.gouv.fr`
2. IGN-backed route or elevation data
3. OSM extract or Overpass discovery
4. openrouteservice enrichment only for missing deterministic fields

Outside France:

1. OSM extract or Overpass
2. country or regional open data portals when added
3. openrouteservice enrichment

## Runtime and Parallelization Model

Every major stage must be invokable independently from CLI.

### Example commands

```bash
cd generator
node src/cli/crawl.mjs --scope france --provider data-gouv --concurrency 4
node src/cli/crawl.mjs --scope europe-west --provider geofabrik --concurrency 2
node src/cli/normalize.mjs --scope france --limit 5000
node src/cli/generate.mjs --scope france --batch-size 64 --model ollama:qwen2.5:14b
node src/cli/judge.mjs --scope france --batch-size 128
node src/cli/publish.mjs --sink filesystem --decision publish
```

### Queue model

Use database-backed work queues:

- `crawl_jobs`
- `normalize_jobs`
- `generate_jobs`
- `judge_jobs`
- `publish_jobs`

Each worker:

- claims a job row
- heartbeats progress
- marks completion or retry

This allows:

- multi-process execution
- safe resume
- no duplicated work

## Configuration

All configuration should live inside `generator/`.

### Required config groups

- provider credentials
- provider rate limits
- accepted licenses
- geography priority weights
- route thresholds
- image thresholds
- LLM model config
- publish sink config

### Example environment variables

- `GENERATOR_CACHE_DB=./data/cache/ingestion.db`
- `OLLAMA_HOST=http://127.0.0.1:11434`
- `OPENAI_API_KEY=...`
- `FLICKR_API_KEY=...`
- `ORS_API_KEY=...`
- `IGN_API_KEY=...`

## Quality Thresholds

Start with conservative defaults.

### Route thresholds

- minimum route points: `20`
- minimum distance: `2 km`
- maximum distance without special tag: `45 km`
- maximum ascent-to-distance anomaly ratio threshold
- reject geometries with self-intersection spikes above threshold

### Image thresholds

- minimum width: `1200 px`
- minimum relevance score
- no publish if attribution is incomplete

### Text thresholds

- title max length compatible with product constraints
- description target length: `60` to `160` words
- reject unsupported claims count above `0`

## Reporting

Each batch should generate a machine-readable report and a human-readable summary.

### Machine-readable

- JSON report with counts, failures, and score distributions

### Human-readable

- Markdown report in `generator/data/reports/`

Report sections:

- datasets crawled
- routes normalized
- routes rejected
- routes quarantined
- images accepted
- images missing
- top failure reasons
- provider health
- judge distribution

## Phased Delivery Plan

### Phase 0: foundation

- create docs
- create cache DB layer
- create CLI skeletons
- create job table model

### Phase 1: France core pipeline

- `data-gouv` crawler
- `osm-overpass` crawler
- `geofabrik` crawler
- deterministic normalizer
- IGN elevation enrichment
- Wikimedia Commons images
- deterministic judge
- filesystem publisher

### Phase 2: LLM enrichment and batch judge

- structured LLM generator
- LLM judge
- batch scoring
- quarantine and retry loop

### Phase 3: global expansion

- wider Geofabrik coverage
- openrouteservice elevation backfill
- Flickr commercial-safe image backfill
- region priority scheduler

### Phase 4: sink expansion

- MySQL sink
- richer manifests
- periodic refresh jobs

## Immediate Implementation Order

1. Create SQLite cache schema and job queue tables.
2. Add crawler adapters for `data-gouv`, `geofabrik`, and `osm-overpass`.
3. Add deterministic route normalization and GPX export.
4. Add IGN-first elevation enrichment with ORS fallback.
5. Add Wikimedia Commons image discovery and license filter.
6. Add deterministic judge and batch summary.
7. Add filesystem publisher.
8. Add structured `llm-generator`.
9. Add LLM judge.
10. Add Flickr commercial-safe image backfill.

## Non-Negotiable Safety Rules

- Reject any record with unknown route license.
- Reject any image with unknown or non-commercially unsafe license.
- Never overwrite raw source payloads.
- Keep every publish decision reproducible from cached inputs.
- Keep LLM outputs versioned by prompt and model.
- Allow records with missing images only if route data quality is high enough.

## Success Criteria

The system is successful when:

- it can ingest and normalize large French hiking datasets autonomously
- it can scale to global OSM-backed discovery
- it can run `crawler`, `llm-generator`, `judge`, and `publisher` in parallel
- it can resume from cache after interruption
- it can publish high-confidence hikes without violating future commercial licensing constraints
- it can backfill missing images later without republishing the whole dataset

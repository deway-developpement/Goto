import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJsonFromText } from '../src/providers/ollama.mjs';

test('parseJsonFromText handles direct JSON', () => {
  const parsed = parseJsonFromText('{"hello":"world"}');
  assert.deepEqual(parsed, { hello: 'world' });
});

test('parseJsonFromText handles wrapped JSON', () => {
  const parsed = parseJsonFromText('```json\n{"hello":"world"}\n```');
  assert.deepEqual(parsed, { hello: 'world' });
});

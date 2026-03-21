export async function generateJsonWithOllama({
  host,
  model,
  prompt,
  system,
  keepAlive = '5m',
}) {
  if (!host) {
    throw new Error('An Ollama host is required.');
  }

  if (!model) {
    throw new Error('An Ollama model is required.');
  }

  const response = await fetch(`${trimTrailingSlash(host)}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      system,
      format: 'json',
      stream: false,
      keep_alive: keepAlive,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Ollama request failed with ${response.status}: ${errorBody}`);
  }

  const payload = await response.json();
  const responseText = typeof payload.response === 'string' ? payload.response.trim() : '';

  return {
    payload,
    responseText,
    parsed: parseJsonFromText(responseText),
  };
}

export function parseJsonFromText(text) {
  if (!text) {
    throw new Error('The model returned an empty response.');
  }

  try {
    return JSON.parse(text);
  } catch {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error('The model response did not contain a valid JSON object.');
    }

    const candidate = text.slice(startIndex, endIndex + 1);
    return JSON.parse(candidate);
  }
}

function trimTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

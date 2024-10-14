import { readFileSync } from 'node:fs';

import { snake_case2camelCase } from './utils';

export const readFromJson = async (table: string) => {
  const json = (
    await import(`@/json/final/${snake_case2camelCase(table)}.json`)
  ).default;

  const keysMap: Record<string, boolean> = {};
  // biome-ignore lint/complexity/noForEach: <explanation>
  json.forEach((row: object) =>
    // biome-ignore lint/complexity/noForEach: <explanation>
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    Object.keys(row).forEach((key) => (keysMap[key] = true))
  );

  const keys = Object.keys(keysMap);

  // Ensure all keys for each row are filled or padded with null if DNE
  const data = json.map((row: object) => {
    const entries = keys.map((key) => [
      key,
      row[snake_case2camelCase(key) as keyof typeof row] ?? null,
    ]);
    return Object.fromEntries(entries);
  });

  return data;
};

export const readFromCsv = async (table: string) => {
  const csv = readFileSync(
    `./csv/${snake_case2camelCase(table)}.csv`,
    'utf-8'
  ).toString();

  const lines = csv.split('\n');
  const keys = lines[0].split(',').map((key) => key.trim());
};

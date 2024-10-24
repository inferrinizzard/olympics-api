import { readFileSync } from 'node:fs';

import neatCsv from 'neat-csv';

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
  const csvString = readFileSync(
    `./csv/${snake_case2camelCase(table)}.csv`,
    'utf-8'
  )
    .toString()
    .replaceAll(/\s+,/g, ',');

  const lines = csvString.split('\n');
  const keys = lines[0].split(',').map((key) => key.trim());

  const raw = await neatCsv(csvString);

  const data = raw.map((_row) => {
    const row = Object.fromEntries(
      Object.entries(_row).map(([k, v]) => [k.trim(), v.trim()])
    );

    const entries = keys.map((key) => [
      key,
      row[snake_case2camelCase(key) as keyof typeof row] ?? null,
    ]);
    return Object.fromEntries(entries);
  });

  return data;
};

import { readFileSync } from 'node:fs';
import { db, pgp } from './db';

const insertData = async <Row extends Record<string, any>>(
  table: string,

  data: Row[],
  force = false
) => {
  if (!force) {
    // check if rows already exist
    const hasRows = await db
      .oneOrNone(`SELECT TRUE FROM ${table} LIMIT 1`)
      .then((res) => res?.bool ?? false);
    if (hasRows) {
      console.log(`${table} already has data, skipping`);
      return;
    }
  } else {
    await db.none(`TRUNCATE TABLE ${table} CASCADE;`);
  }

  // load data into table
  return db
    .none(
      pgp.helpers
        .insert(
          data,
          new pgp.helpers.ColumnSet(Object.keys(data[0]), { table })
        )
        .concat(' ON CONFLICT DO NOTHING')
    )
    .then(() => console.log(`Loaded table ${table} with ${data.length} rows`));
};

import gamesDetail from '@/json/final/gamesDetail.json';

const keys = readFileSync('./csv/gamesDetail.csv')
  .toString()
  .split('\n')[0]
  .split(',')
  .map((key) => key.trim());

const snake_case2camelCase = (str: string) =>
  str.replace(/_(\w)/g, (char) => char.toUpperCase().replace('_', ''));

const data = gamesDetail.map(({ image, ...games }) => {
  const entries = keys.map((key) => [
    key,
    games[snake_case2camelCase(key) as keyof typeof games] ?? null,
  ]);
  return Object.fromEntries(entries);
});

await insertData('games_detail', data);

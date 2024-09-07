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

const snake_case2camelCase = (str: string) =>
  str.replace(/_(\w)/g, (char) => char.toUpperCase().replace('_', ''));

const insertTableData = async (
  table: `${'country' | 'games' | 'sports'}_detail`
) => {
  const json = (
    await import(`@/json/final/${snake_case2camelCase(table)}.json`)
  ).default;

  console.log(json);

  const keys = readFileSync(`./csv/${snake_case2camelCase(table)}.csv`)
    .toString()
    .split('\n')[0]
    .split(',')
    .map((key) => key.trim());

  const data = json.map((row: object) => {
    const entries = keys.map((key) => [
      key,
      row[snake_case2camelCase(key) as keyof typeof row] ?? null,
    ]);
    return Object.fromEntries(entries);
  });

  await insertData(table, data);
};

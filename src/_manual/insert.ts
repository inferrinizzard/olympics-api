import { db, pgp } from '../db';
import { readFromCsv, readFromJson } from './readFromFile';

const insertData = async <Row extends Record<string, object>>(
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

/**
 * @param table snake_case name of table
 * @param fromFile read from csv or json ?
 * @param force overwrite existing data ?
 */
const readAndInitInsertQuery = async (
  table: string,
  fromFile: 'csv' | 'json' = 'json',
  force = false
) => {
  const data = await (fromFile === 'json'
    ? readFromJson(table)
    : readFromCsv(table));

  await insertData(table, data, force);
};

await readAndInitInsertQuery('sports_detail', 'json', true);
readAndInitInsertQuery('participation_records', 'csv');

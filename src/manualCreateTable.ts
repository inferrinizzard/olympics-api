import { readFileSync } from 'node:fs';
import { db } from './db';

const createTable = (sqlPath: string) => {
  const query = readFileSync(sqlPath, 'utf-8');
  const queryString = query.toString();

  if (!query) {
    console.log('Failed');
    return;
  }

  return db.query({ text: queryString });
};

// createTable('./sql/secondary/participation_records_table.sql');

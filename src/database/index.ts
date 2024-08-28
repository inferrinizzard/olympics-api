import { createTables } from './initTables';
import { loadData } from './loadData';

export const initDatabase = async () => {
  console.info('Initializing database...');
  await createTables();

  console.info('Loading data...');
  return loadData();
};

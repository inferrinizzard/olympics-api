import { createTables } from './initTables.js';
import { loadData } from './loadData.js';

export const initDatabase = async () => {
	console.info('Initializing database...');
	await createTables();

	console.info('Loading data...');
	return loadData();
};

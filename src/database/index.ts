import { createTables } from './initTables.js';
import { loadData } from './loadData.js';

export const initDatabase = async () => {
	await createTables();
	return loadData();
};

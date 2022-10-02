import { db } from '../db.js';

import { promises } from 'fs';
const { readFile, readdir: readDir } = promises;

const sqlDir = `sql`;

export const createTables = async () => {
	console.info('Creating primary tables');
	const initPrimaryTables = readDir(`${sqlDir}/primary`)
		.then(files => Promise.all(files.map(file => readFile(`${sqlDir}/primary/${file}`, 'utf8'))))
		.then(files => Promise.all(files.map(query => db.query(query))));

	await initPrimaryTables;

	console.info('Creating secondary tables');
	const initSecondaryTables = readDir(`${sqlDir}/secondary`)
		.then(files => Promise.all(files.map(file => readFile(`${sqlDir}/secondary/${file}`, 'utf8'))))
		.then(files => Promise.all(files.map(query => db.query(query))));

	await initSecondaryTables;

	console.info('Creating views');
	const initViews = readDir(`${sqlDir}/views`)
		.then(files =>
			Promise.all(files.sort().map(file => readFile(`${sqlDir}/views/${file}`, 'utf8')))
		)
		.then(files => Promise.all(files.map(query => db.query(query))));

	return initViews;
};

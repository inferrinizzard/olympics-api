import { db } from '../db.js';

import { promises } from 'fs';
const { readFile, readdir: readDir } = promises;

const sqlDir = `sql`;

export const createTables = async () => {
	const initPrimaryTables = readDir(`${sqlDir}/primary`)
		.then(files => Promise.all(files.map(file => readFile(`${sqlDir}/primary/${file}`, 'utf8'))))
		.then(files => Promise.all(files.map(query => db.query(query))));

	await initPrimaryTables;

	const initSecondaryTables = readDir(`${sqlDir}/secondary`)
		.then(files => Promise.all(files.map(file => readFile(`${sqlDir}/secondary/${file}`, 'utf8'))))
		.then(files => Promise.all(files.map(query => db.query(query))));

	await initSecondaryTables;

	const initViews = readDir(`${sqlDir}/views`)
		.then(files => Promise.all(files.map(file => readFile(`${sqlDir}/views/${file}`, 'utf8'))))
		.then(files => Promise.all(files.map(query => db.query(query))));

	return initViews;
};

import { JSDOM } from 'jsdom';

import Wikipedia from './index.js';

import type { SportDetailRow } from '../types/olympics.js';

const summerSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=6&formatversion=2';
const winterSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=10&formatversion=2';

const readSportsTable = (sourceTable: HTMLTableElement) => {
	let sportsData: SportDetailRow[] = [];

	for (let i = 0; i < sourceTable.rows.length; i++) {
		const row = sourceTable.rows[i] as HTMLTableRowElement;
		if (!row.cells[2].querySelector('img')) continue;

		const sportName = row.cells[0].textContent!.trim();
		const sportCode = row.cells[1].textContent!.trim().replace('*', '');
		const sportIcon = (row.cells[2].firstElementChild!.firstElementChild as HTMLImageElement).src;

		sportsData.push({
			name: sportName,
			sport: sportCode,
			icon: sportIcon,
		});
	}

	return sportsData;
};

export const readSportsDetail = async () => {
	// read DOM from parsed HTML request
	const summerSportsTable = Wikipedia.extractTable(
		new JSDOM(await Wikipedia.getPageHtml(summerSportsUrl))
	);
	const winterSportsTable = Wikipedia.extractTable(
		new JSDOM(await Wikipedia.getPageHtml(winterSportsUrl))
	);
	// extract table data
	const summerSportsData = readSportsTable(summerSportsTable);
	const winterSportsData = readSportsTable(winterSportsTable);

	return [...summerSportsData, ...winterSportsData].filter(
		({ code }, i, self) => self.findIndex(({ code: c }) => c === code) === i // dedupe by finding first instance of sportCode
	);
};

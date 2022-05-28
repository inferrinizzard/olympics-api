import { JSDOM } from 'jsdom';

import Wikipedia from './index.js';

import type { MedalTotalsRow } from '../types';

const medalTotalsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=All-time_Olympic_Games_medal_table&prop=text&section=1&formatversion=2';

export const readMedalTotals = async () => {
	const medalTotalsTable = Wikipedia.extractTable(
		new JSDOM(await Wikipedia.getPageHtml(medalTotalsUrl))
	);

	const readCell = (cell: HTMLTableCellElement) => parseInt(cell.textContent!.replace(',', ''));

	let medalsData: MedalTotalsRow[] = [];

	for (let i = 2; i < medalTotalsTable.rows.length - 1; i++) {
		const row = medalTotalsTable.rows[i] as HTMLTableRowElement;
		const leadCell = row.cells[0].textContent;
		const countryCode = (leadCell!.match(/(?<=[(])[A-Z0-9]{3}(?=[)])/) ?? [''])[0].trim();

		const summerGold = readCell(row.cells[2]);
		const summerSilver = readCell(row.cells[3]);
		const summerBronze = readCell(row.cells[4]);
		const winterGold = readCell(row.cells[7]);
		const winterSilver = readCell(row.cells[8]);
		const winterBronze = readCell(row.cells[9]);
		const totalGold = readCell(row.cells[12]);
		const totalSilver = readCell(row.cells[13]);
		const totalBronze = readCell(row.cells[14]);

		[
			{
				country: countryCode,
				season: 'summer',
				gold: summerGold,
				silver: summerSilver,
				bronze: summerBronze,
				total: summerGold + summerSilver + summerBronze,
			},
			{
				country: countryCode,
				season: 'winter',
				gold: winterGold,
				silver: winterSilver,
				bronze: winterBronze,
				total: winterGold + winterSilver + winterBronze,
			},
			{
				country: countryCode,
				season: 'total',
				gold: totalGold,
				silver: totalSilver,
				bronze: totalBronze,
				total: totalGold + totalSilver + totalBronze,
			},
		].forEach(medal => medalsData.push(medal));
	}

	return medalsData;
};

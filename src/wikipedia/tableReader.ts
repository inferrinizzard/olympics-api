import { JSDOM } from 'jsdom';

import { CountryDetail } from '../models/olympics';

// gets the last table element within DOM
export const extractTable = (element: JSDOM) =>
	[...element.window.document.body.firstElementChild?.children!]
		.reverse()
		.find(element => element.tagName.toLowerCase() === 'table')! as HTMLTableElement;

type CountryTableOutput = CountryDetail & { attended: number[]; hosted: number[] };

export const readCountryTable = (sourceTable: HTMLTableElement) => {
	const presentMarker = /[•^]/;
	const hostMarker = 'H';

	let years = [];
	let countryData: Record<string, CountryTableOutput> = {};

	// extract years from header row
	const headerRow = sourceTable.rows[0] as HTMLTableRowElement;
	for (let i = headerRow.cells.length - 2, century = '20'; i >= 2; i--) {
		const year = headerRow.cells[i].textContent;
		const fullYear = parseInt(century + headerRow.cells[i].textContent);
		if (year === '00' || year == '02') {
			century = parseInt(century) - 1 + '';
		}

		years.unshift(fullYear);
	}

	for (let i = 1; i < sourceTable.rows.length - 1; i++) {
		const row = sourceTable.rows[i] as HTMLTableRowElement;

		const nameColumn = row.cells[0] as HTMLTableCellElement;
		if (nameColumn.textContent?.trim().match(/^[A-Z]{1}$/)) {
			continue; // skip if letter
		}

		// get country name and flag
		const countryName = (nameColumn.textContent
			?.trim()
			.match(/[\p{Letter}A-z-\s]+?(?=[\[(])|[\p{Letter}A-z-\s]+/u) ?? [''])[0].trim();
		const countryFlagUrl =
			(nameColumn.firstElementChild as HTMLImageElement).src?.replace(/^[/]{0,2}/, 'https://') ??
			'';

		// get NOC code
		const codeColumn = row.cells[1] as HTMLTableCellElement;
		const countryCode = codeColumn.textContent!.trim();

		let hosted = [];
		let attended = [];

		// iterate through cells and mark years present
		for (
			let cellIndex = 0, yearIndex = 0;
			cellIndex < row.cells.length - 3;
			cellIndex++, yearIndex++
		) {
			let cell = row.cells[cellIndex + 2] as HTMLTableCellElement; // start from 3rd column

			// skip rowspan cells
			while (
				[1916, 1940, 1944].includes(years[yearIndex]) &&
				!row.querySelector('td[rowspan]') // checks if this is a row with rowspan
			) {
				yearIndex++;
			}

			// handle wide cells
			if (cell.hasAttribute('colspan')) {
				const width = cell.getAttribute('colspan')!;
				yearIndex += parseInt(width) - 1;
				continue;
			}

			const year = years[yearIndex];
			const cellMarker = cell.textContent?.trim()[0] ?? '';
			if (presentMarker.test(cellMarker)) {
				attended.push(year);
			} else if (cellMarker === hostMarker) {
				hosted.push(year);
			}
		}

		countryData[countryCode] = {
			code: countryCode,
			name: countryName,
			flag: countryFlagUrl,
			hosted,
			attended,
		};
	}

	return countryData;
};

interface MedalData {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}
type MedalTableData = Record<'summer' | 'winter' | 'total', MedalData>;

export const readMedalsTable = (sourceTable: HTMLTableElement) => {
	const readCell = (cell: HTMLTableCellElement) => parseInt(cell.textContent!.replace(',', ''));

	let medalsData: Record<string, MedalTableData> = {};

	for (let i = 2; i < sourceTable.rows.length - 1; i++) {
		const row = sourceTable.rows[i] as HTMLTableRowElement;
		const leadCell = row.cells[0].textContent;
		const countryCode = (leadCell!.match(/(?<=[(])[A-Z0-9]{3}(?=[)])/) ?? [''])[0].trim();

		const summerGold = readCell(row.cells[2]);
		const summerSilver = readCell(row.cells[3]);
		const summerBronze = readCell(row.cells[4]);
		const winterGold = readCell(row.cells[6]);
		const winterSilver = readCell(row.cells[7]);
		const winterBronze = readCell(row.cells[8]);
		const totalGold = readCell(row.cells[10]);
		const totalSilver = readCell(row.cells[11]);
		const totalBronze = readCell(row.cells[12]);

		medalsData[countryCode] = {
			summer: {
				gold: summerGold,
				silver: summerSilver,
				bronze: summerBronze,
				total: summerGold + summerSilver + summerBronze,
			},
			winter: {
				gold: winterGold,
				silver: winterSilver,
				bronze: winterBronze,
				total: winterGold + winterSilver + winterBronze,
			},
			total: {
				gold: totalGold,
				silver: totalSilver,
				bronze: totalBronze,
				total: totalGold + totalSilver + totalBronze,
			},
		};
	}

	return medalsData;
};

interface SportsTableData {
	code: string;
	name: string;
	icon: string;
	years: Record<number, number>;
	demonstration: number[];
}

export const readSportsTable = (season: string, sourceTable: HTMLTableElement) => {
	let years: number[] = [];
	const startYear = season === 'summer' ? '96' : '24';

	let sportsData: Record<string, SportsTableData> = {};

	// extract years from header row
	const headerRow = sourceTable.rows[0] as HTMLTableRowElement;
	for (
		let i = headerRow.cells.length - 1, century = '20';
		i >= (season === 'summer' ? 2 : 4);
		i--
	) {
		const year = headerRow.cells[i].textContent!.trim();
		const fullYear = parseInt(century + headerRow.cells[i].textContent);
		if (year === '00' || year == '02') {
			century = parseInt(century) - 1 + '';
		}

		years.push(fullYear);
	}
	years = years.reverse();

	const footerRows = season === 'summer' ? 3 : 2;
	for (let i = 1; i < sourceTable.rows.length - footerRows; i++) {
		const row = sourceTable.rows[i] as HTMLTableRowElement;
		if (row.cells.length < 3) continue;

		const sportName = row.cells[0].textContent!.trim();
		const sportCode = row.cells[1].textContent!.trim().replace('*', '');
		const sportIcon = (row.cells[2].firstElementChild!.firstElementChild as HTMLImageElement).src;

		let sportYears: SportsTableData['years'] = {};
		let demonstration: SportsTableData['demonstration'] = [];

		// find start index of years (first col where header col matches year)
		const distanceFromStart = [...row.cells].findIndex(
			cell => headerRow.cells[cell.cellIndex - 2]?.textContent?.trim() === startYear
		);
		const startIndex =
			row.cells.length > years.length ? row.cells.length - years.length : distanceFromStart;

		for (let j = startIndex; j < row.cells.length; j++) {
			const cell = row.cells[j] as HTMLTableCellElement;

			if (cell?.hasAttribute('çolspan')) {
				continue;
			}

			const year = years[j - startIndex];
			const presentMarker = cell.textContent?.trim();

			if (presentMarker === '•') {
				demonstration.push(year);
			} else if (!isNaN(parseInt(presentMarker!))) {
				sportYears[year] = parseInt(presentMarker!);
			}
		}
		sportsData[sportCode] = {
			name: sportName,
			code: sportCode,
			icon: sportIcon,
			years: sportYears,
			demonstration,
		};
	}

	return sportsData;
};

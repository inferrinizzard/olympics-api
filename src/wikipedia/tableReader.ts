import { JSDOM } from 'jsdom';

import { CountryDetail, OlympicsSeason } from '../models/olympics';

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

export interface EventTableData {
	sport: string;
	discipline: string;
	event: string;
	sex: string;
	medal: 'GOLD' | 'SILVER' | 'BRONZE';
	winner: string | string[];
}

export const readEventWinners = (document: Document): EventTableData[] => {
	const baseElement = document.querySelector('div.mw-parser-output')!;

	let outputTable: EventTableData[] = [];

	let currentSport = '';
	let currentDiscipline = '';
	let currentSex = '';
	// iterate through all html children
	for (let el = 0; el < baseElement.children.length; el++) {
		const element = baseElement.children[el];

		// for each new sport header
		if (element.tagName === 'H2') {
			// console.log(currentSport, currentDiscipline);
			currentSport = element.querySelector('span.mw-headline')!.textContent!.trim();
			currentDiscipline = '';
			currentSex = '';
		}
		// either sport discipline or sex
		if (element.tagName === 'H3' || element.tagName === 'H4') {
			if (element.textContent!.match(/men's|mixed/i)) {
				currentSex = element.textContent!.match(/[A-z]+(?!=')/)![0].toUpperCase();
			} else {
				currentDiscipline = element.querySelector('span.mw-headline')!.textContent!;
			}
		}

		// process each table with previous header
		if (element.tagName === 'TABLE' && element.className.includes('wikitable')) {
			const table = element as HTMLTableElement;
			const header = table.rows[0] as HTMLTableRowElement;

			// handling for wider columns
			const colWidth: Record<string, number> = {
				gold: +(header.cells[1].getAttribute('colspan') ?? 1),
				silver: +(header.cells[2].getAttribute('colspan') ?? 1),
				bronze: +(header.cells[3].getAttribute('colspan') ?? 1),
			};
			const medalLookup: string[] = [
				'EVENT',
				...new Array(colWidth.gold).fill('GOLD'),
				...new Array(colWidth.silver).fill('SILVER'),
				...new Array(colWidth.bronze).fill('BRONZE'),
			];

			for (let rowIndex = 1, rowHeight = 1; rowIndex < table.rows.length; rowIndex += rowHeight) {
				const row = table.rows[rowIndex] as HTMLTableRowElement;
				// for multiple medal winners per medal type
				rowHeight = +(row.cells[0].getAttribute('rowspan') ?? 1);

				let event = row.cells[0].textContent!.trim().replace(/details$/, '');
				// if sex is encoded in event name
				if (event.match(/men's|mixed/i)) {
					// extract men|women|mixed
					currentSex = event.match(/[A-z]+(?!=')/)![0].toUpperCase();
					event = event.replace(/women's|men's|mixed/i, '').trim();
					if (event.length === 0) {
						event = currentSport;
					}
					event = event[0].toUpperCase() + event.slice(1).toLowerCase();
				}

				let winners: Record<string, string[]> = {
					GOLD: [],
					SILVER: [],
					BRONZE: [],
				};

				for (
					let cellIndex = 1, nextRowIndex = 0;
					cellIndex < row.cells.length;
					cellIndex += colWidth[medalLookup[cellIndex].toLowerCase()]
				) {
					const cellHeight = +(row.cells[cellIndex].getAttribute('rowspan') ?? 1);

					let countries: string[] = [];
					const flags = row.cells[cellIndex].querySelectorAll('img');
					if (flags) {
						countries = [...flags].map(flag => flag.nextElementSibling!.textContent!.trim());
					}

					// iterate through any multiple medal winners, reading successive rows
					if (cellHeight < rowHeight) {
						for (let winnerCount = 0; winnerCount < rowHeight - cellHeight; winnerCount++) {
							const nextCell = table.rows[rowIndex + winnerCount + 1].cells[nextRowIndex];
							const flag = nextCell.querySelector('img');
							countries.push(flag!.nextElementSibling!.textContent!.trim());
						}
						nextRowIndex++; // index for next row
					}

					// add winners to list if found
					if (flags) {
						winners[medalLookup[cellIndex]] = countries;
					}
				}

				Object.entries(winners).forEach(
					([medal, countries]) =>
						countries.length &&
						outputTable.push({
							sport: currentSport,
							discipline: currentDiscipline,
							event,
							sex: currentSex,
							medal: medal as EventTableData['medal'],
							winner: countries.length > 1 ? countries : countries[0],
						})
				);
			}
		}
	}

	return outputTable;
};

import got from 'got';
import { JSDOM } from 'jsdom';

import { CountryDetail, MedalsGames, SportDetail, YearDetail } from './models/olympics';
import { WikipediaParse } from './models/wikipedia';
import { extractTable } from './parseWikipedia.js';

const summer = (year: number | string) => year + '-S';
const winter = (year: number | string) => year + '-W';

const summerCountriesUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Summer_Olympic_Games&prop=text&section=11&formatversion=2';
const winterCountriesUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Winter_Olympic_Games&prop=text&section=9&formatversion=2';
const medalsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=All-time_Olympic_Games_medal_table&prop=text&section=1&formatversion=2';
const summerSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=6&formatversion=2';
const winterSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=10&formatversion=2';

export class Olympics {
	private htmlTables: Partial<{
		summer: string;
		winter: string;
		medals: string;
		summerSports: string;
		winterSports: string;
	}> = {};

	private summerCountriesTable!: HTMLTableElement;
	private winterCountriesTable!: HTMLTableElement;
	private medalsTable!: HTMLTableElement;
	private summerSportsTable!: HTMLTableElement;
	private winterSportsTable!: HTMLTableElement;

	medals: Record<string, MedalsGames> = {};

	countries: Set<string> = new Set();
	countryDetail: Record<string, CountryDetail> = {}; // TS4.7 use typeof this.countries

	summerGames: number[] = [];
	winterGames: number[] = [];
	gamesDetail: Record<string, YearDetail> = {}; // TS4.7, use typeof this.summerGames|this.winterGames

	sports: Record<string, SportDetail> = {};

	async init() {
		this.htmlTables = await Promise.all(
			Object.entries({
				summer: summerCountriesUrl,
				winter: winterCountriesUrl,
				medals: medalsUrl,
				summerSports: summerSportsUrl,
				winterSports: winterSportsUrl,
			}).map(([key, url]) =>
				got
					.get(url)
					.json()
					.then(data => (data as WikipediaParse).parse.text)
					.then(val => [key, val])
			)
		).then(data =>
			data.reduce(
				(acc, [key, data]) => ({ ...acc, [key as string]: data }),
				{} as typeof this.htmlTables
			)
		);

		this.summerCountriesTable = extractTable(new JSDOM(this.htmlTables.summer));
		this.winterCountriesTable = extractTable(new JSDOM(this.htmlTables.winter));
		this.readCountryTable(this.summerCountriesTable, this.summerGames, summer);
		this.readCountryTable(this.winterCountriesTable, this.winterGames, winter);

		this.medalsTable = extractTable(new JSDOM(this.htmlTables.medals));
		this.readMedalsTable();

		this.summerSportsTable = extractTable(new JSDOM(this.htmlTables.summerSports));
		this.winterSportsTable = extractTable(new JSDOM(this.htmlTables.winterSports));
		this.readSportsTable('summer', this.summerSportsTable);
		this.readSportsTable('winter', this.winterSportsTable);

		return this;
	}

	private readCountryTable(
		sourceTable: HTMLTableElement,
		outputList: number[],
		indexer: typeof summer
	) {
		const presentMarker = /[•^]/;
		const hostMarker = 'H';

		// extract years from header row
		const headerRow = sourceTable.rows[0] as HTMLTableRowElement;
		for (let i = headerRow.cells.length - 2, century = '20'; i >= 2; i--) {
			const year = headerRow.cells[i].textContent;
			const fullYear = parseInt(century + headerRow.cells[i].textContent);
			if (year === '00' || year == '02') {
				century = parseInt(century) - 1 + '';
			}

			outputList.unshift(fullYear);

			this.gamesDetail[indexer(fullYear)] = {
				countries: new Set(),
				host: '',
				cities: [],
				sports: [],
			};

			if ([1916, 1940, 1944].includes(fullYear)) {
				this.gamesDetail[indexer(fullYear)].host = 'SKIPPED';
			}
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
			this.countries.add(countryCode);

			// iterate through cells and mark years present
			for (
				let cellIndex = 0, yearIndex = 0;
				cellIndex < row.cells.length - 3;
				cellIndex++, yearIndex++
			) {
				let cell = row.cells[cellIndex + 2] as HTMLTableCellElement; // start from 3rd column

				// skip rowspan cells
				while (
					[1916, 1940, 1944].includes(outputList[yearIndex]) &&
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

				const gameYear = indexer(outputList[yearIndex]);
				const cellMarker = cell.textContent?.trim()[0] ?? '';
				if (presentMarker.test(cellMarker)) {
					this.gamesDetail[gameYear].countries.add(countryCode);
				} else if (cellMarker === hostMarker) {
					this.gamesDetail[gameYear].host = countryCode;
				}
			}

			this.countryDetail[countryCode] = {
				name: countryName,
				flag: countryFlagUrl,
				hosted: [],
				attended: { summer: [], winter: [] },
				medals: {},
			};
		}
	}

	private readMedalsTable() {
		const readCell = (cell: HTMLTableCellElement) => parseInt(cell.textContent!.replace(',', ''));

		for (let i = 2; i < this.medalsTable.rows.length - 1; i++) {
			const row = this.medalsTable.rows[i] as HTMLTableRowElement;
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

			this.medals[countryCode] = {
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
	}

	private readSportsTable(season: string, sourceTable: HTMLTableElement) {
		let years: number[] = [];
		const startYear = season === 'summer' ? '96' : '24';

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
		// for (let i = 4; i < 8; i++) {
		for (let i = 1; i < sourceTable.rows.length - footerRows; i++) {
			const row = sourceTable.rows[i] as HTMLTableRowElement;
			if (row.cells.length < 3) continue;

			const sportName = row.cells[0].textContent!.trim();
			const sportCode = row.cells[1].textContent!.trim().replace('*', '');
			const sportIcon = (row.cells[2].firstElementChild!.firstElementChild as HTMLImageElement).src;
			let sportYears: number[] = [];

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

				if (presentMarker && (presentMarker === '•' || !isNaN(parseInt(presentMarker)))) {
					sportYears.push(year);

					const gameCode = year + '-' + (season === 'summer' ? 'S' : 'W');
					if (!(gameCode in this.gamesDetail)) {
						this.gamesDetail[gameCode] = {
							countries: new Set(),
							host: '',
							cities: [],
							sports: [],
						};
					}
					// this.gamesDetail[gameCode].sports[sportCode] =
					// 	presentMarker === '•' ? 'Demonstration' : parseInt(presentMarker);
				}
			}

			this.sports[sportCode] = {
				name: sportName,
				code: sportCode,
				icon: sportIcon,
				years: sportYears,
			};
		}
	}
}

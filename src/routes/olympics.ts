import { JSDOM } from 'jsdom';
import got from 'got';

import { WikipediaParse } from '../models/wikipedia';

export interface YearDetail {
	countries: Set<string>;
	host: string;
	cities: string[];
}

export interface CountryDetail {
	name: string;
	flag: string;
	hosted: string[];
	attended: {
		summer: number[];
		winter: number[];
	};
	medals: {};
}

export class Olympics {
	private htmlSummerCountriesTable!: string;
	private summerDom!: JSDOM;
	summerCountriesTable!: HTMLTableElement;

	countries: Set<string> = new Set();
	countryDetail: { [country: string]: CountryDetail } = {};

	summerGames: number[] = [];
	gamesDetail: { [year: number]: YearDetail } = {};

	async init() {
		this.htmlSummerCountriesTable = await got
			.get(
				'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Summer_Olympic_Games&prop=text&section=11&formatversion=2'
			)
			.json()
			.then(data => (data as WikipediaParse).parse.text);

		this.summerDom = new JSDOM(this.htmlSummerCountriesTable);
		this.summerCountriesTable = this.summerDom.window.document.body.firstElementChild
			?.lastElementChild as HTMLTableElement;

		this.readSummerTable();

		return this;
	}

	private readSummerTable() {
		const presentMarker = /[•^]/;

		// extract years from header row
		const headerRow = this.summerCountriesTable.rows[0] as HTMLTableRowElement;
		for (let i = 2, century = '18'; i < headerRow.cells.length - 1; i++) {
			const year = headerRow.cells[i].textContent;
			if (year === '00') {
				century = parseInt(century) + 1 + '';
			}
			const fullYear = parseInt(century + headerRow.cells[i].textContent);

			this.summerGames.push(fullYear);
			this.gamesDetail[fullYear] = { countries: new Set(), host: '', cities: [] };

			if ([1916, 1940, 1944].includes(fullYear)) {
				this.gamesDetail[fullYear].host = 'SKIPPED';
			}
		}

		for (let i = 1; i < this.summerCountriesTable.rows.length - 1; i++) {
			const row = this.summerCountriesTable.rows[i] as HTMLTableRowElement;

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
					[1916, 1940, 1944].includes(this.summerGames[yearIndex]) &&
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

				const gameYear = this.summerGames[yearIndex];
				const cellMarker = cell.textContent?.trim()[0] ?? '';
				if (presentMarker.test(cellMarker)) {
					this.gamesDetail[gameYear].countries.add(countryCode);
				} else if (cellMarker === 'H') {
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
}

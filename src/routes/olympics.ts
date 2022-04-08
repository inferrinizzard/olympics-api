import { JSDOM } from 'jsdom';
import got from 'got';

import { WikipediaParse } from '../models/wikipedia';

export class Olympics {
	private htmlSummerCountriesTable!: string;
	private summerDom!: JSDOM;
	summerCountriesTable!: HTMLTableElement;

	countries: string[] = [];
	countryDetail: { [country: string]: { [key: string]: string } } = {};

	years: number[] = [];
	yearDetail: { [year: number]: { [key: string]: string } } = {};

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
		const headerRow = this.summerCountriesTable.rows[0] as HTMLTableRowElement;
		for (let [i, century] = [2, '18']; i < headerRow.cells.length - 1; i++) {
			const year = headerRow.cells[i].textContent;
			if (year === '00') {
				century = parseInt(century) + 1 + '';
			}
			const fullYear = parseInt(century + headerRow.cells[i].textContent);

			this.years.push(fullYear);
			this.yearDetail[fullYear] = {};
		}

		for (let i = 1; i < this.summerCountriesTable.rows.length - 1; i++) {
			const row = this.summerCountriesTable.rows[i] as HTMLTableRowElement;

			const nameColumn = row.cells[0] as HTMLTableCellElement;
			if (nameColumn.textContent?.trim().match(/^[A-Z]{1}$/)) {
				continue; // skip if letter
			}

			const countryName = (nameColumn.textContent
				?.trim()
				.match(/[\p{Letter}A-z-\s]+?(?=[\[(])|[\p{Letter}A-z-\s]+/u) ?? [''])[0].trim();

			const codeColumn = row.cells[1] as HTMLTableCellElement;
			const countryCode = codeColumn.textContent!.trim();
			this.countries.push(countryCode);

			this.countryDetail[countryCode] = { name: countryName };

			for (let j = 0; j < row.cells.length; j++) {
				const cell = row.cells[j] as HTMLTableCellElement;

				// console.log(cell.textContent);
			}
			// console.log(row.innerHTML);
		}
	}
}

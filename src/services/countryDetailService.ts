import { db } from '../db.js';

import { CountryDetailRow } from '../models/countryDetail';

export class CountryDetailService {
	countryDetailTable = 'country_detail';

	public getAll = (): Promise<string[]> =>
		db
			.any(`SELECT DISTINCT country FROM ${this.countryDetailTable} ORDER BY country;`)
			.then((rows: Pick<CountryDetailRow, 'country'>[]) => rows.map(row => row.country));

	public get = (country: string): Promise<CountryDetailRow | null> =>
		db.oneOrNone(`SELECT * FROM ${this.countryDetailTable} WHERE country = '${country}';`);
}

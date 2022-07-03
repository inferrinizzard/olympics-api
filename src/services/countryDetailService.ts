import { db } from '../db.js';

import type { CountryDetailRow, CountryId } from '../models/countryDetail';

export class CountryDetailService {
	countryDetailTable = 'country_detail';

	public getAll = (): Promise<CountryId[]> =>
		db
			.any(`SELECT DISTINCT country FROM ${this.countryDetailTable} ORDER BY country;`)
			.then((rows: Pick<CountryDetailRow, 'country'>[]) => rows.map(row => row.country));

	public get = (country: CountryId): Promise<CountryDetailRow | null> =>
		db.oneOrNone(`SELECT * FROM ${this.countryDetailTable} WHERE country = '${country}';`);
}

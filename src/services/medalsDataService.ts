import { db } from '../db.js';

import type { CountryId } from '../models/countryData';
import type { GamesId } from '../models/gamesData.js';
import type { CountryMedalRow, MedalTotalsRow } from '../models/medalsData';

export class MedalsDataService {
	medalTotalsTable = 'medal_totals';
	countryMedalsTable = 'country_medals';

	public getTotals = (): Promise<Record<CountryId, Exclude<MedalTotalsRow, CountryId>>> =>
		db
			.any(
				`
				SELECT
					country,
					SUM(gold) AS gold,
					SUM(silver) AS silver,
					SUM(bronze) AS bronze,
					SUM(total) AS total
				FROM ${this.medalTotalsTable}
				GROUP BY country
				ORDER BY country;
				`
			)
			.then(rows => rows.reduce((acc, { country, ...row }) => ({ ...acc, [country]: row }), {}));

	public getCountryTotals = (country: CountryId): Promise<MedalTotalsRow | null> =>
		db.oneOrNone(`SELECT * FROM ${this.medalTotalsTable} WHERE country = '${country}';`);

	public getGameMedals = (
		game: GamesId
	): Promise<Record<CountryId, Pick<CountryMedalRow, 'gold' | 'silver' | 'bronze' | 'total'>>> =>
		db.any(`SELECT * FROM ${this.countryMedalsTable} WHERE game = '${game}';`).then(rows =>
			rows.reduce(
				(acc, { country, gold, silver, bronze, total }) => ({
					...acc,
					[country]: { gold, silver, bronze, total },
				}),
				{}
			)
		);
}

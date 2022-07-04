import { db } from '../db.js';

import type { CountryDetailRow, CountryId } from '../models/countryData';
import type { GamesDetailRow, GamesId } from '../models/gamesData.js';
import type { SportDetailRow, SportId } from '../models/sportsData.js';

export class ImageDataService {
	countryDetailTable = 'country_detail';
	gamesDetailTable = 'games_detail';
	sportsDetailTable = 'sports_detail';

	public getCountryFlags = (): Promise<Record<CountryId, CountryDetailRow['flag']>> =>
		db
			.any(`SELECT country, flag FROM ${this.countryDetailTable} ORDER BY country;`)
			.then((rows: Pick<CountryDetailRow, 'country' | 'flag'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.country]: row.flag }), {})
			);

	public getGamesEmblems = (): Promise<Record<GamesId, GamesDetailRow['emblem']>> =>
		db
			.any(`SELECT game, emblem FROM ${this.gamesDetailTable} ORDER BY game;`)
			.then((rows: Pick<CountryDetailRow, 'game' | 'emblem'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.game]: row.emblem }), {})
			);

	public getSportsLogos = (): Promise<Record<SportId, SportDetailRow['logo']>> =>
		db
			.any(`SELECT sport, logo FROM ${this.countryDetailTable} ORDER BY sport;`)
			.then((rows: Pick<SportDetailRow, 'sport' | 'logo'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.sport]: row.logo }), {})
			);
}

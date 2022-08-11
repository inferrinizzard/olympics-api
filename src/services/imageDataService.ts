import { db } from '../db.js';

import type { CountryDetailRow, CountryFlagMap } from '../models/countryData';
import type { GamesDetailRow, GamesEmblemMap } from '../models/gamesData.js';
import type { SportDetailRow, SportsIconMap } from '../models/sportsData.js';

export class ImageDataService {
	countryDetailTable = 'country_detail';
	gamesDetailTable = 'games_detail';
	sportsDetailTable = 'sports_detail';

	public getCountryFlags = (): Promise<CountryFlagMap> =>
		db
			.any(`SELECT country, flag FROM ${this.countryDetailTable} ORDER BY country;`)
			.then((rows: Pick<CountryDetailRow, 'country' | 'flag'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.country]: row.flag }), {})
			);

	public getGamesEmblems = (): Promise<GamesEmblemMap> =>
		db
			.any(`SELECT game, emblem FROM ${this.gamesDetailTable} ORDER BY game;`)
			.then((rows: Pick<GamesDetailRow, 'game' | 'emblem'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.game]: row.emblem }), {})
			);

	public getSportsLogos = (): Promise<SportsIconMap> =>
		db
			.any(`SELECT sport, logo FROM ${this.countryDetailTable} ORDER BY sport;`)
			.then((rows: Pick<SportDetailRow, 'sport' | 'logo'>[]) =>
				rows.reduce((acc, row) => ({ ...acc, [row.sport]: row.logo }), {})
			);
}

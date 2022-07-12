import { db } from '../db.js';

import type { GamesId } from '../models/gamesData.js';
import type { SportDetailRow, SportId, SportsEventRow } from '../models/sportsData';

export class SportsDataService {
	sportsDetailTable = 'sports_detail';
	sportsEventsTable = 'sports_events';

	public getAll = (): Promise<SportId[]> =>
		db
			.any(`SELECT DISTINCT sport FROM ${this.sportsDetailTable} ORDER BY sport;`)
			.then((rows: Pick<SportDetailRow, 'sport'>[]) => rows.map(row => row.sport));

	public get = (sport: SportId): Promise<SportDetailRow | null> =>
		db.oneOrNone(`SELECT * FROM ${this.sportsDetailTable} WHERE sport = '${sport}';`);

	public getEvent = (sport: SportId, game: GamesId): Promise<SportsEventRow | null> =>
		db.oneOrNone(
			`
			SELECT *
			FROM ${this.sportsEventsTable}
			WHERE sport = '${sport}'
				AND game = '${game}';
			`
		);
}

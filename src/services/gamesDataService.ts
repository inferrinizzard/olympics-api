import { db } from '../db.js';

import type { GamesDetailRow, GamesId } from '../models/gamesData';

export class GamesDetailService {
	gamesDetailTable = 'games_detail';

	public getAll = (): Promise<GamesId[]> =>
		db
			.any(`SELECT DISTINCT game FROM ${this.gamesDetailTable} ORDER BY game;`)
			.then((rows: Pick<GamesDetailRow, 'game'>[]) => rows.map(row => row.game));

	public get = (game: GamesId): Promise<GamesDetailRow | null> =>
		db.oneOrNone(`SELECT * FROM ${this.gamesDetailTable} WHERE game = '${game}';`);
}

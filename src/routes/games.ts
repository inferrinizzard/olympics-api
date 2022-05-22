import express from 'express';

import { db } from '../db.js';

import type { GamesDetailRow } from '../scraper/types';

const router = express.Router();

const gamesDetailTable = 'games_detail';

// /games
router.get('/', (req, res) =>
	db
		.any(`SELECT DISTINCT game FROM ${gamesDetailTable} ORDER BY game;`)
		.then((rows: Pick<GamesDetailRow, 'game'>[]) => res.json(rows.map(row => row.game)))
		.catch(err => res.status(500).json(err))
);

// /games/:gamesKey
router.get('/:gamesKey', async (req, res) =>
	db
		.oneOrNone(`SELECT * FROM ${gamesDetailTable} WHERE game = '${req.params.gamesKey}';`)
		.then((output: GamesDetailRow) =>
			Object.keys(output).length
				? res.json(output)
				: res.status(404).json(`Games with gamesKey:${req.params.gamesKey} not found`)
		)
		.catch(err => res.status(500).json(err))
);

// // /games/:year/season/:season
// router.get('/:year([0-9]{4})/season/:season(winter|summer)', async (req, res) => {
// 	const gameYear = parseInt(req.params.year);
// 	const gameSeason = req.params.season as OlympicsSeason;
// 	const gamesKey = olympics.getGamesKey(gameYear, gameSeason);

// 	if (!olympics.gamesDetail[gamesKey]) {
// 		res.status(404).send(`Games with year:${gameYear} and season:${gameSeason} not found`);
// 	} else {
// 		res.json(olympics.gamesDetail[gamesKey]);
// 	}
// });

export default router;

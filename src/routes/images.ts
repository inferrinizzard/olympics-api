import express from 'express';

import { db } from '../db.js';

import type {
	CountryDetailRow,
	GamesDetailRow,
	SportDetailRow,
} from '../scraper/types/database.js';

const router = express.Router();

// /images
router.get('/', (req, res) => res.json(['games', 'countries', 'sports']));

// /images/games
router.get('/games', async (req, res) =>
	db
		.any(`SELECT game, emblem FROM games_detail ORDER BY game;`)
		.then((rows: Pick<GamesDetailRow, 'game' | 'emblem'>[]) =>
			res.json(rows.reduce((acc, row) => ({ ...acc, [row.game]: row.emblem }), {}))
		)
		.catch(err => res.status(500).json(err))
);

// /images/countries
router.get('/countries', async (req, res) =>
	db
		.any(`SELECT country, flag FROM country_detail ORDER BY country;`)
		.then((rows: Pick<CountryDetailRow, 'country' | 'flag'>[]) =>
			res.json(rows.reduce((acc, row) => ({ ...acc, [row.country]: row.flag }), {}))
		)
		.catch(err => res.status(500).json(err))
);

// /images/sports
router.get('/sports', async (req, res) =>
	db
		.any(`SELECT sport, logo FROM sports_detail ORDER BY sport;`)
		.then((rows: Pick<SportDetailRow, 'sport' | 'logo'>[]) =>
			res.json(rows.reduce((acc, row) => ({ ...acc, [row.sport]: row.logo }), {}))
		)
		.catch(err => res.status(500).json(err))
);

// /images/sports/:gamesKey
router.get('/sports/:gamesKey', async (req, res) => {
	res.status(503).json({ error: 'Not yet ready' });
});

export default router;

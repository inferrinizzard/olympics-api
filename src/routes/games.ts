import express, { json } from 'express';

import { olympics } from './index.js';
import { OlympicsSeason } from '../models/olympics.js';

const router = express.Router();

// /games
router.get('/', (req, res) => res.json(Object.keys(olympics.gamesDetail)));

// /games/:gamesKey
router.get('/:gamesKey', async (req, res) => {
	const gamesKey = req.params.gamesKey;

	if (!olympics.gamesDetail[gamesKey]) {
		res.status(404).send(`Games with gamesKey:${gamesKey} not found`);
	} else {
		res.json(olympics.gamesDetail[gamesKey]);
	}
});

// /games/:year/season/:season
router.get('/:year([0-9]{4})/season/:season(winter|summer)', async (req, res) => {
	const gameYear = parseInt(req.params.year);
	const gameSeason = req.params.season as OlympicsSeason;
	const gamesKey = olympics.getGamesKey(gameYear, gameSeason);

	if (!olympics.gamesDetail[gamesKey]) {
		res.status(404).send(`Games with year:${gameYear} and season:${gameSeason} not found`);
	} else {
		res.json(olympics.gamesDetail[gamesKey]);
	}
});

export default router;

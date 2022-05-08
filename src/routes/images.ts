import express, { json } from 'express';

import { olympics } from './index.js';

const router = express.Router();

// /images
router.get('/', (req, res) => res.json(['games', 'countries', 'sports']));

// /images/games
router.get('/games', async (req, res) => {
	res.json(
		Object.fromEntries(
			Object.entries(olympics.gamesDetail).map(([gamesKey, gameDetail]) => [
				gamesKey,
				gameDetail.image,
			])
		)
	);
});

// /images/countries
router.get('/countries', async (req, res) => {
	res.json(
		Object.fromEntries(
			Object.entries(olympics.countryDetail).map(([countryCode, countryDetail]) => [
				countryCode,
				countryDetail.flag,
			])
		)
	);
});

// /images/sports
router.get('/sports', async (req, res) => {
	res.json(
		Object.fromEntries(
			Object.entries(olympics.sportsDetail).map(([sportCode, sportDetail]) => [
				sportCode,
				sportDetail.icon,
			])
		)
	);
});

// /images/sports/:gamesKey
router.get('/sports/:gamesKey', async (req, res) => {
	res.status(503).json({ error: 'Not yet ready' });
});

export default router;

import express from 'express';

import { olympics } from './index.js';
import { OlympicsSeason } from '../models/olympics.js';

const router = express.Router();

// /games
router.get('/', (req, res) =>
	res.json({
		summer: olympics.countryAttendance
			.where({ season: OlympicsSeason.SUMMER })
			.distinct(['year'])
			.year.sort(),
		winter: olympics.countryAttendance
			.where({ season: OlympicsSeason.WINTER })
			.distinct(['year'])
			.year.sort(),
	})
);

// /games/:year/season/:season
router.get('/:year([0-9]{4})/season/:season(winter|summer)', async (req, res) => {
	const gamesDetailsPromise = olympics.getGamesDetail(
		parseInt(req.params.year),
		req.params.season as OlympicsSeason
	);

	// add 404 when year DNE
	gamesDetailsPromise.then(gamesDetails => res.json(gamesDetails));
});

export default router;

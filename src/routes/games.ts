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
router.get('/:year([0-9]{4})/season/:season(winter|summer)', (req, res) => {
	const attendance = olympics.countryAttendance.where({
		year: parseInt(req.params.year),
		season: req.params.season as OlympicsSeason,
	});

	// add 404 when year DNE
	res.json({
		year: req.params.year,
		season: req.params.season,
		host: attendance.table.find(({ host }) => host)?.code,
		countries: attendance.distinct(['code']).code.sort(),
	});
});

export default router;

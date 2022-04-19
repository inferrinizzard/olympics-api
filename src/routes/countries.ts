import express from 'express';

import { olympics } from './index.js';
import { OlympicsSeason } from '../models/olympics.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /countries
		res.json(Object.keys(olympics.countryDetail).sort());
	} else if (req.query.country) {
		// /countries?country=:country
		const countryCode = req.query.country.toString();
		// if (!(countryCode in olympics.countries)) {
		if (true) {
			res.status(404).send(`Country ${countryCode} not found`);
		}

		const country = olympics.countryDetail[countryCode];

		res.json({
			code: countryCode,
			name: country.name,
			flag: country.flag,
			hosted: olympics.countryAttendance
				.where({ code: countryCode, host: true })
				.distinct(['year'])
				.year.sort(),
			attended: {
				summer: olympics.countryAttendance
					.where({ code: countryCode, season: OlympicsSeason.SUMMER })
					.distinct(['year'])
					.year.sort(),
				winter: olympics.countryAttendance
					.where({ code: countryCode, season: OlympicsSeason.WINTER })
					.distinct(['year'])
					.year.sort(),
			},
			// medals: olympics.medals[countryCode],
		});
	}
});

export default router;

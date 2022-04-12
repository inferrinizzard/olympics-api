import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /countries
		res.send([...olympics.countries]);
	} else if (req.query.country) {
		// /countries?country=:country
		const countryCode = req.query.country.toString();
		const country = olympics.countryDetail[countryCode];

		res.send({
			code: countryCode,
			name: country.name,
			flag: country.flag,
			hosted: Object.entries(olympics.gamesDetail)
				.filter(([_, detail]) => detail.host === countryCode)
				.map(([year]) => year),
			attended: {
				summer: Object.entries(olympics.gamesDetail)
					.filter(([year, detail]) => year.endsWith('S') && detail.countries.has(countryCode))
					.map(([year]) => parseInt(year)),
				winter: Object.entries(olympics.gamesDetail)
					.filter(([year, detail]) => year.endsWith('W') && detail.countries.has(countryCode))
					.map(([year]) => parseInt(year)),
			},
			medals: olympics.medals[countryCode],
		});
	}
});

export default router;

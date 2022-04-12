import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /medals
		res.json(olympics.medals);
	} else if (req.query.season) {
		// /medals?season=summer|winter
		const season = req.query.season.toString();
		if (season === 'summer' || season === 'winter') {
			res.json(
				Object.entries(olympics.medals).reduce(
					(acc, [country, medals]) => ({ ...acc, [country]: medals[season] }),
					{}
				)
			);
		}
	} else if (req.query.country) {
		// /medals?country=:country
		let out: any = olympics.medals[req.query.country.toString()];

		if (req.query.season) {
			// /medals?country=:country&season=summer|winter
			const season = req.query.season.toString();
			if (season === 'summer' || season === 'winter') {
				out = out[season];
			}
		}
		res.json(out);
	}
});

export default router;

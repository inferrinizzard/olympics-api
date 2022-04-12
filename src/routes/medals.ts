import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /medals
		res.send(olympics.medals);
	} else if (req.query.season) {
		// /medals?season=summer|winter
		const season = req.query.season.toString();
		if (season === 'summer' || season === 'winter') {
			res.send(
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
		res.send(out);
	}
});

export default router;

import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

// /medals
router.get('/', (req, res) =>
	res.json(
		olympics.medalsTotals.where({ season: 'total' }).table.map(({ season, ...rest }) => rest)
	)
);

// /medals/countries/:country
router.get('/countries/:country([A-Z]{3})', (req, res) => {
	const countryCode = req.params.country;
	const countryMedals = olympics.medalsTotals.where({ country: countryCode });

	if (countryMedals.table.length === 0) {
		res.status(404).send(`Country ${countryCode} not found`);
	} else {
		res.json(
			countryMedals.table.reduce(
				(acc, { season, country, ...rest }) => ({ ...acc, [season!]: rest }),
				{}
			)
		);
	}
});

export default router;

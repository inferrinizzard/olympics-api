import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

// /countries
router.get('/', (req, res) => res.json(Object.keys(olympics.countryDetail).sort()));

// /countries/:country
router.get('/:country([A-Z]{3})', (req, res) => {
	const countryCode = req.params.country;
	if (!olympics.countryDetail[countryCode]) {
		res.status(404).send(`Country ${countryCode} not found`);
	} else {
		res.json(olympics.countryDetail[countryCode]);
	}
});

export default router;

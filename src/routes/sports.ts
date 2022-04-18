import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

// /sports
router.get('/', (req, res) => res.json(Object.keys(olympics.sportsDetail)));

// /sports/:sport
router.get('/:sport([A-Z0-9]{3})', (req, res) => {
	const sportCode = req.params.sport;
	if (!olympics.sportsDetail[sportCode]) {
		res.status(404).send(`Sport ${sportCode} not found`);
	} else {
		res.json(olympics.sportsDetail[sportCode]);
	}
});

export default router;

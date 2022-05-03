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

// /sports/:sport/events/:gamesKey
router.get('/:sport([A-Z0-9]{3})/events/:game', (req, res) => {
	const events = olympics.sportsEvents.where({ code: req.params.sport, game: req.params.game });

	res.json(events.table);
});

export default router;

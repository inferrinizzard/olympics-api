import express from 'express';

import { db } from '../db.js';

import type { SportDetailRow } from '../scraper/types';

const router = express.Router();

const sportsDetailTable = 'sports_detail';
const sportsEventsTable = 'sports_events';

// /sports
router.get('/', (req, res) =>
	db
		.any(`SELECT DISTINCT sport FROM ${sportsDetailTable} ORDER BY sport;`)
		.then((rows: Pick<SportDetailRow, 'sport'>[]) => res.json(rows.map(row => row.sport)))
		.catch(err => res.status(500).json(err))
);

// /sports/:sport
router.get('/:sport([A-Z0-9]{3})', (req, res) =>
	db
		.oneOrNone(`SELECT * FROM ${sportsDetailTable} WHERE sport = '${req.params.sport}';`)
		.then((output: SportDetailRow) =>
			Object.keys(output).length
				? res.json(output)
				: res.status(404).json(`Sport ${req.params.sport} not found`)
		)
		.catch(err => res.status(500).json(err))
);

// /sports/:sport/events/:gamesKey
router.get('/:sport([A-Z0-9]{3})/events/:game', (req, res) =>
	db
		.oneOrNone(
			`
			SELECT *
			FROM ${sportsEventsTable}
			WHERE sport = '${req.params.sport}'
				AND game = '${req.params.game}';
			`
		)
		.then(output =>
			output?.length && output.events.length
				? res.json(output.events)
				: res.status(404).json(`Sport ${req.params.sport} not found for Game: ${req.params.game}`)
		)
		.catch(err => res.status(500).json(err))
);

export default router;

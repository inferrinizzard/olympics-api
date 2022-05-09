import express from 'express';

import { db } from '../db.js';

const router = express.Router();

const medalTotalsTable = 'medal_totals';

// /medals
router.get('/', (req, res) =>
	db
		.any(
			`
			SELECT
				country,
				SUM(gold) AS gold,
				SUM(silver) AS silver,
				SUM(bronze) AS bronze,
				SUM(total) AS total
			FROM ${medalTotalsTable}
			GROUP BY country
			ORDER BY country;
			`
		)
		.then(rows =>
			res.json(rows.reduce((acc, { country, ...row }) => ({ ...acc, [country]: row }), {}))
		)
		.catch(err => res.status(500).json(err))
);

// /medals/countries/:country
router.get('/countries/:country([A-Z]{3})', (req, res) =>
	db
		.any(`SELECT * FROM ${medalTotalsTable} WHERE country = ${req.params.country};`)
		.then(rows =>
			rows.length
				? res.json(rows.reduce((acc, { season, ...row }) => ({ ...acc, [season]: row }), {}))
				: res.status(404).json(`Country ${req.params.country} not found`)
		)
		.catch(err => res.status(500).json(err))
);

export default router;

import express from 'express';

import { db } from '../db.js';

import type { CountryDetailRow } from '../scraper/types';

const router = express.Router();

const countryDetailTable = 'country_detail';

// /countries
router.get('/', (req, res) =>
	db
		.any(`SELECT DISTINCT country FROM ${countryDetailTable} ORDER BY country;`)
		.then((rows: Pick<CountryDetailRow, 'country'>[]) => res.json(rows.map(row => row.country)))
		.catch(err => res.status(500).json(err))
);

// /countries/:country
router.get('/:country([A-Z]{3})', (req, res) =>
	db
		.oneOrNone(`SELECT * FROM ${countryDetailTable} WHERE country = '${req.params.country}';`)
		.then((output: CountryDetailRow) =>
			Object.keys(output).length
				? res.json(output)
				: res.status(404).json(`Country ${req.params.country} not found`)
		)
		.catch(err => res.status(500).json(err))
);

export default router;

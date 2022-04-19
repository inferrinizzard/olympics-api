import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /sports
		res.json(Object.keys(olympics.sportsDetail));
	}
});

export default router;

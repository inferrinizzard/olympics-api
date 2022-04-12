import express from 'express';

import { olympics } from './index.js';

const router = express.Router();

router.get('/', (req, res) => {
	if (!Object.keys(req.query).length) {
		// base /games
		res.json({
			summer: olympics.summerGames.map(year => year + '-S'),
			winter: olympics.winterGames.map(year => year + '-W'),
		});
	} else if (req.query.year) {
		// /games?year=:year where year is [0-9]{4}-S|W
		// or /games?year=:year&season=summer|winter

		let gameCode = req.query.year.toString();
		if (
			/^[0-9]{4}$/.test(gameCode) &&
			['summer', 'winter'].includes(req.query.season?.toString() ?? '')
		) {
			gameCode += req.query.season === 'winter' ? '-W' : '-S';
		}

		const game = olympics.gamesDetail[gameCode];
		res.json({
			countries: [...game.countries],
			host: game.host,
			cities: game.cities,
		});
	}
});

export default router;

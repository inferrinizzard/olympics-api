import express from 'express';

import { Olympics } from './olympics.js';

let olympics = await new Olympics().init();

export const register = (app: express.Application) => {
	app.get('/countries', (req, res) => {
		if (!Object.keys(req.query).length) {
			// base /countries
			res.send([...olympics.countries]);
		} else if (req.query.country) {
			// /countries?country=:country
			const countryCode = req.query.country.toString();
			const country = olympics.countryDetail[countryCode];

			res.send({
				code: countryCode,
				name: country.name,
				flag: country.flag,
				hosted: Object.entries(olympics.gamesDetail)
					.filter(([_, detail]) => detail.host === countryCode)
					.map(([year]) => year),
				attended: {
					summer: Object.entries(olympics.gamesDetail)
						.filter(([year, detail]) => year.endsWith('S') && detail.countries.has(countryCode))
						.map(([year]) => parseInt(year)),
					winter: Object.entries(olympics.gamesDetail)
						.filter(([year, detail]) => year.endsWith('W') && detail.countries.has(countryCode))
						.map(([year]) => parseInt(year)),
				},
				medals: olympics.medals[countryCode],
			});
		}
	});

	app.get('/games', (req, res) => {
		if (!Object.keys(req.query).length) {
			// base /games
			res.send({
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
			res.send({
				countries: [...game.countries],
				host: game.host,
				cities: game.cities,
			});
		}
	});

	app.get('/medals', (req, res) => {
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
};

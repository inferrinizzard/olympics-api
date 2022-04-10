import express from 'express';

import { Olympics } from './olympics.js';

let olympics = await new Olympics().init();

export const register = (app: express.Application) => {
	app.get('/countries', (req, res) => {
		res.send([...olympics.countries]);
	});

	app.get('/countries/:country', (req, res) => {
		let countryCode = req.params.country;
		const country = olympics.countryDetail[countryCode];

		res.send({
			code: countryCode,
			name: country.name,
			flag: country.flag,
			hosted: Object.entries(olympics.gamesDetail)
				.filter(([_, detail]) => detail.host === countryCode)
				.map(([year]) => parseInt(year)),
			attended: {
				summer: Object.entries(olympics.gamesDetail)
					.filter(([_, detail]) => detail.countries.has(countryCode))
					.map(([year]) => parseInt(year)),
				winter: [],
			},
			medals: {},
		});
	});

	app.get('/games', (req, res) => {
		res.send({
			summer: olympics.summerGames.map(year => year + '-S'),
		});
	});

	app.get('/games/:game', (req, res) => {
		// accept: year(if only 1), year-s/year-w, year-summer/year-winter
		const game = olympics.gamesDetail[parseInt(req.params.game)];
		res.send({
			countries: [...game.countries],
			host: game.host,
			cities: game.cities,
		});
	});
};

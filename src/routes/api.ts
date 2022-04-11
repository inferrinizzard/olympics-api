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
	});

	app.get('/games', (req, res) => {
		res.send({
			summer: olympics.summerGames.map(year => year + '-S'),
			winter: olympics.winterGames.map(year => year + '-W'),
		});
	});

	app.get('/games/:game', (req, res) => {
		// accept: year(if only 1), year-s/year-w, year-summer/year-winter
		const game = olympics.gamesDetail[req.params.game];
		res.send({
			countries: [...game.countries],
			host: game.host,
			cities: game.cities,
		});
	});

	app.get('/medals', (req, res) => {
		// console.log(req.query);
		res.send(olympics.medals);
	});

	// app.get('/medals/:country', (req, res) => {
	// 	res.send(olympics.medals[req.params.country]);
	// });

	// app.get('/medals/season=:season', (req, res) => {
	// 	const season = req.params.season;
	// 	if (season === 'summer' || season === 'winter') {
	// 		res.send(
	// 			Object.entries(olympics.medals).reduce(
	// 				(acc, [country, medals]) => ({ ...acc, [country]: medals[season] }),
	// 				{}
	// 			)
	// 		);
	// 	}
	// });
};

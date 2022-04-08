import express from 'express';

import { Olympics } from './olympics.js';

let olympics = await new Olympics().init();

export const register = (app: express.Application) => {
	app.get('/countries', (req, res) => {
		res.send(olympics.countries);
	});

	app.get('/countries/:country', (req, res) => {
		res.send(olympics.countryDetail[req.params.country]);
	});

	app.get('/games', (req, res) => {
		res.send({
			summer: olympics.summerGames,
		});
	});

	app.get('/games/:game', (req, res) => {
		const game = olympics.gamesDetail[parseInt(req.params.game)];
		res.send({
			countries: [...game.countries],
			host: game.host,
			cities: game.cities,
		});
	});
};

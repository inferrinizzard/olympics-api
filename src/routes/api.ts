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
};

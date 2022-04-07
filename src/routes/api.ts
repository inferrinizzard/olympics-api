import express from 'express';
import got from 'got';

import { WikipediaParse } from '../models/wikipedia';

export const register = (app: express.Application) => {
	app.get('/countries', (req, res) => {
		let test = got.get(
			'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Summer_Olympic_Games&prop=text&section=11&formatversion=2'
		);

		test.json().then(_data => {
			const data = _data as WikipediaParse;
			res.send(data.parse.text);
		});
	});
};

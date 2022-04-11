import express from 'express';

import { Olympics } from './olympics.js';
import * as routes from './routes/api.js';

const port = process.env.PORT || 3000;

let app = express();

new Olympics().init().then(olympics => {
	routes.register(app, olympics);

	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}`);
	});
});

import express from 'express';

import routes from './routes/index.js';

const port = process.env.PORT || 3000;

const app = express();

app.use('/', routes);

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

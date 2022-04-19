import express from 'express';

import routes from './routes/index.js';

const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => res.redirect('/api'));
app.use('/api', routes);

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

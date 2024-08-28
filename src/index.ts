import express from 'express';

import routes from './routes/index';

import { initDatabase } from './database/index';
import { Olympics } from './scraper/olympics';

const port = process.env.PORT || 3000;

// const olympics = await new Olympics().init();
await initDatabase();

const app = express();

app.get('/', (req, res) => res.redirect('/api'));
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

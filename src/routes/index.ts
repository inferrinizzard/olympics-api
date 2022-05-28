import express from 'express';

import countriesRouter from './countries.js';
import gamesRouter from './games.js';
import medalsRouter from './medals.js';
import sportsRouter from './sports.js';
import imagesRouter from './images.js';

const router = express.Router();

router.get('/', (req, res) => res.send('Swagger UI'));

router.use('/countries', countriesRouter);
router.use('/games', gamesRouter);
router.use('/medals', medalsRouter);
router.use('/sports', sportsRouter);
router.use('/images', imagesRouter);

export default router;

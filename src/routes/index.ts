import express from 'express';

import { Olympics } from '../olympics.js';
import countriesRouter from './countries.js';
import gamesRouter from './games.js';
import medalsRouter from './medals.js';

export const olympics = await new Olympics().init();

const router = express.Router();

router.get('/', (req, res) => res.send('Swagger UI'));

router.use('/countries', countriesRouter);
router.use('/games', gamesRouter);
router.use('/medals', medalsRouter);

export default router;

import express from 'express';

import { Olympics } from '../olympics.js';
import api from './api.js';

export const olympics = await new Olympics().init();

const router = express.Router();

router.use('/', api);

export default router;

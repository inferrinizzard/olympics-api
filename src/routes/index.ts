import express from 'express';

import { RegisterRoutes } from './routes';

import swaggerRouter from './swagger';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/api/docs'));

router.use('/docs', swaggerRouter);

RegisterRoutes(router);

export default router;

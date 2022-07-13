import express from 'express';

import { RegisterRoutes } from './routes.js';

import swaggerRouter from './swagger.js';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/api/docs'));

router.use('/docs', swaggerRouter);

RegisterRoutes(router);

export default router;

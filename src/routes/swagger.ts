import express, { Response, Request } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerJson from '../swagger.json' assert { type: 'json' };

const router = express.Router();

router.use('/', swaggerUi.serve, async (_req: Request, res: Response) => {
	return res.send(swaggerUi.generateHTML(swaggerJson));
});

export default router;

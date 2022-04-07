import express from 'express';

import * as routes from './routes/api.js';

const port = process.env.PORT || 3000;

let app = express();

routes.register(app);

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});

import express from 'express';

const port = process.env.PORT || 3000;

let app = express();

app.get('/', (req, res) => res.send('Received a GET HTTP method'));

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});

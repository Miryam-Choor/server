// app.js
import express from 'express';
import mainRouter from './routes/index.route.js';

const app = express();

app.use(express.json());

app.use('/api', mainRouter);

app.all('/', (req, res) => {
    res.send('Welcome to the library!');
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
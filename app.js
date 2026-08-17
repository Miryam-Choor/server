// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mainRouter from './routes/index.route.js';
import { addCurrentDate, logGetDate } from './middlewares/custom.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

// מאפשר גישה מכל פרויקט client ומטפל בבעיות CORS
app.use(cors());

// אבטחת השרת על ידי הוספת HTTP headers מתאימים
app.use(helmet());

// הגבלת מספר הבקשות מכתובת IP מסוימת למניעת מתקפות Brute Force או העמסת יתר
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// הדפסת נתוני בקשות בקונסול במצב פיתוח בלבד
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(addCurrentDate);

app.use(logGetDate);

app.use('/api', mainRouter);

app.all('/', (req, res) => {
    res.send('Welcome to the library!');
});

app.use(notFound);

app.use(errorHandler);

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
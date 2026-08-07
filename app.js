// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mainRouter from './routes/index.route.js';

const app = express();

app.use(express.json());

// מאפשר גישה מכל פרויקט client ומטפל בבעיות CORS
app.use(cors());

// אבטחת השרת על ידי הוספת HTTP headers מתאימים
app.use(helmet());

// הגבלת מספר הבקשות מכתובת IP מסוימת למניעת מתקפות Brute Force או העמסת יתר
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 100 // הגבלה ל-100 בקשות לכל IP
});
app.use(limiter);

// הדפסת נתוני בקשות בקונסול במצב פיתוח בלבד
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api', mainRouter);

app.all('/', (req, res) => {
    res.send('Welcome to the library!');
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
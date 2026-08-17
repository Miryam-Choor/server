// middlewares/error.middleware.js

// לא נמצא
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// שגיאה כללית
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    res.json({
        error: {
            message: err.message,
            type: 'server error',
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
        }
    });
};
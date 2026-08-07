// middlewares/custom.middleware.js

// add currentDate
export const addCurrentDate = (req, res, next) => {
    req.currentDate = new Date().toISOString();
    next(); 
};

// print only for GET req
export const logGetDate = (req, res, next) => {
    if (req.method === 'GET') {
        console.log(`[GET Request] Current Date & Time: ${req.currentDate}`);
    }
    next();
};
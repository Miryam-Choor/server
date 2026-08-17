// middlewares/validate.middleware.js

export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            // איסוף כל הודעות השגיאות למערך אחד
            const errorMessages = error.details.format ? error.details.map(detail => detail.message) : error.details.map(d => d.message);
            
            res.status(400);
            return next(new Error(errorMessages.join('; ')));
        }
        
        next();
    };
};
// utils/upload.js - פונקציות עזר
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        // שם הקובץ: קוד הספר + חותמת זמן + הסיומת המקורית
        const bookId = req.params.id || req.body.id || 'default';
        const uniqueSuffix = Date.now();
        cb(null, `${bookId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, 
    fileFilter: fileFilter
});
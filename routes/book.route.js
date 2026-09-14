// routes/book.route.js
import { Router } from 'express';
import { 
    getAllBooks, 
    getBookById, 
    addBook, 
    updateBook, 
    borrowBook, 
    returnBook, 
    deleteBook 
} from '../controllers/book.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { bookSchema } from '../validators/validation.schemas.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', upload.single('image'), validate(bookSchema), addBook);
router.put('/:id', validate(bookSchema), updateBook);
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.delete('/:id', deleteBook);

export default router;
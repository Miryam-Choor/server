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

const router = Router();

router.get('/', getAllBooks);
router.get('/:code', getBookByCode);
router.post('/', addBook);
router.put('/:code', updateBook);
router.post('/:code/borrow', borrowBook);
router.post('/:code/return', returnBook);
router.delete('/:code', deleteBook);

export default router;
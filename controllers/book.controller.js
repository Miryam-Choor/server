// controllers/book.controller.js
import { books } from '../db.js';
import { users } from '../users.db.js';

export const getAllBooks = (req, res) => {
    let resultBooks = [...books];
    const { search, category, page = 1, limit = 5 } = req.query;

    if (search) {
        resultBooks = resultBooks.filter(b => 
            b.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (category) {
        resultBooks = resultBooks.filter(b => 
            b.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedBooks = resultBooks.slice(startIndex, endIndex);

    res.json({
        totalResults: resultBooks.length,
        currentPage: pageNum,
        totalPages: Math.ceil(resultBooks.length / limitNum),
        data: paginatedBooks
    });
};

export const getBookById = (req, res, next) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => (b.id || b.id) === bookId);

    if (!book) {
        res.status(404);
        return next(new Error('Book not found'));
    }

    res.json(book);
};

export const addBook = (req, res, next) => { 
    const { id, name, category, price } = req.body;

    if (!id || !name || !category || price === undefined) {
        res.status(400);
        return next(new Error('Please provide id, name, category, and price')); 
    }

    const existingBook = books.find(b => (b.id || b.id) === parseInt(id));
    if (existingBook) {
        res.status(400);
        return next(new Error('A book with this id already exists'));
    }

    const imagePath = req.file ? `/public/images/${req.file.filename}` : null;

    const newBook = {
        id: parseInt(id),
        name,
        category,
        price: parseFloat(price),
        image: imagePath,
        isBorrowed: false,
        borrowHistory: []
    };

    books.push(newBook);
    res.status(201).json({ message: 'Book added successfully', book: newBook }); 
};

export const updateBook = (req, res, next) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => (b.id) === bookId);

    if (bookIndex === -1) {
        res.status(404);
        return next(new Error('Book not found'));
    }

    const { name, category, price } = req.body;
    const currentBook = books[bookIndex];

    const updatedBook = {
        ...currentBook,
        name: name !== undefined ? name : currentBook.name,
        category: category !== undefined ? category : currentBook.category,
        price: price !== undefined ? parseFloat(price) : currentBook.price
    };

    books[bookIndex] = updatedBook;
    res.json({ message: 'Book updated successfully', book: updatedBook });
};

export const borrowBook = (req, res, next) => { 
    const bookId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
        res.status(400);
        return next(new Error('User ID is required for borrowing'));
    }

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        res.status(404);
        return next(new Error('User not found'));
    }

    const book = books.find(b => (b.id) === bookId);
    if (!book) {
        res.status(404);
        return next(new Error('Book not found'));
    }

    if (book.isBorrowed) {
        res.status(400);
        return next(new Error('Book is already borrowed'));
    }

    book.isBorrowed = true;
    const borrowDate = new Date().toISOString().split('T')[0];
    book.borrowHistory.push({
        borrowDate,
        userId: parseInt(userId)
    });

    user.borrowedBooks.push(bookId);

    res.json({ message: 'Book borrowed successfully', book, user });
};

export const returnBook = (req, res, next) => { 
    const bookId = parseInt(req.params.id);
    const { userId } = req.body;

    const book = books.find(b => (b.id) === bookId);
    if (!book) {
        res.status(404);
        return next(new Error('Book not found'));
    }

    if (!book.isBorrowed) {
        res.status(400);
        return next(new Error('Book is not currently borrowed')); 
    }

    book.isBorrowed = false;

    if (userId) {
        const user = users.find(u => u.id === parseInt(userId));
        if (user) {
            user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
        }
    }

    res.json({ message: 'Book returned successfully', book }); 
};

export const deleteBook = (req, res, next) => { 
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => (b.id) === bookId);

    if (bookIndex === -1) {
        res.status(404); 
        return next(new Error('Book not found')); 
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully', deletedBook: deletedBook[0] }); 
};
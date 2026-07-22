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

export const getBookById = (req, res) => {
    const bookCode = parseInt(req.params.code);
    const book = books.find(b => (b.code || b.id) === bookCode);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
};

export const addBook = (req, res) => {
    const { code, name, category, price } = req.body;

    if (!code || !name || !category || price === undefined) {
        return res.status(400).json({ error: 'Please provide code, name, category, and price' });
    }

    const existingBook = books.find(b => (b.code || b.id) === parseInt(code));
    if (existingBook) {
        return res.status(400).json({ error: 'A book with this code already exists' });
    }

    const newBook = {
        code: parseInt(code),
        id: parseInt(code),
        name,
        category,
        price: parseFloat(price),
        isBorrowed: false,
        borrowHistory: []
    };

    books.push(newBook);
    res.status(201).json({ message: 'Book added successfully', book: newBook });
};

export const updateBook = (req, res) => {
    const bookCode = parseInt(req.params.code);
    const book = books.find(b => (b.code || b.id) === bookCode);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { name, category, price } = req.body;

    if (name !== undefined) book.name = name;
    if (category !== undefined) book.category = category;
    if (price !== undefined) book.price = parseFloat(price);

    res.json({ message: 'Book updated successfully', book });
};

export const borrowBook = (req, res) => {
    const bookCode = parseInt(req.params.code);
    const { userCode } = req.body;

    if (!userCode) {
        return res.status(400).json({ error: 'User code is required for borrowing' });
    }

    const user = users.find(u => u.id === parseInt(userCode));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const book = books.find(b => (b.code || b.id) === bookCode);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (book.isBorrowed) {
        return res.status(400).json({ error: 'Book is already borrowed' });
    }

    book.isBorrowed = true;
    const borrowDate = new Date().toISOString().split('T')[0];
    book.borrowHistory.push({
        borrowDate,
        userCode: parseInt(userCode)
    });

    user.borrowedBooks.push(bookCode);

    res.json({ message: 'Book borrowed successfully', book, user });
};

export const returnBook = (req, res) => {
    const bookCode = parseInt(req.params.code);
    const { userCode } = req.body;

    const book = books.find(b => (b.code || b.id) === bookCode);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.isBorrowed) {
        return res.status(400).json({ error: 'Book is not currently borrowed' });
    }

    book.isBorrowed = false;

    if (userCode) {
        const user = users.find(u => u.id === parseInt(userCode));
        if (user) {
            user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookCode);
        }
    }

    res.json({ message: 'Book returned successfully', book });
};

export const deleteBook = (req, res) => {
    const bookCode = parseInt(req.params.code);
    const bookIndex = books.findIndex(b => (b.code || b.id) === bookCode);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully', deletedBook: deletedBook[0] });
};
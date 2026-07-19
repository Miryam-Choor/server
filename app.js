const express = require('express');
const app = express();
const PORT = 5000;
const { books } = require('./db');

app.use(express.json());

app.all('/', (req, res) => {
    res.send('Welcome to the libary!');
});

// get all books
app.get('/books', (req, res) => {
    let resultBooks = [...books];

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
});

// get book by id
app.get('/books/:code', (req, res) => {
    const bookCode = parseInt(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

// add book
app.post('/books', (req, res) => {
    const { code, name, category, price } = req.body;

    if (!code || !name || !category || price === undefined) {
        return res.status(400).json({ error: 'Please provide code, name, category, and price' });
    }

    const existingBook = books.find(b => b.code === parseInt(code));
    if (existingBook) {
        return res.status(400).json({ error: 'A book with this code already exists' });
    }

    const newBook = {
        code: parseInt(code),
        name,
        category,
        price: parseFloat(price),
        isBorrowed: false,
        borrowHistory: []
    };

    books.push(newBook);
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});

// update book
app.put('/books/:code', (req, res) => {
    const bookCode = parseInt(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { name, category, price } = req.body;

    if (name !== undefined) book.name = name;
    if (category !== undefined) book.category = category;
    if (price !== undefined) book.price = parseFloat(price);

    res.json({ message: 'Book updated successfully', book });
});

// borrow
app.post('/books/:code/borrow', (req, res) => {
    const bookCode = parseInt(req.params.code);
    const { userCode } = req.body;

    if (!userCode) {
        return res.status(400).json({ error: 'User code is required for borrowing' });
    }

    const book = books.find(b => b.code === bookCode);
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

    res.json({ message: 'Book borrowed successfully', book });
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
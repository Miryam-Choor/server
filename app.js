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

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
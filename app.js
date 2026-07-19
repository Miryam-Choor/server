const express = require('express');
const app = express();
const PORT = 5000;
const { books } = require('./db');

app.use(express.json());

app.all('/', (req, res) => {
    res.send('Welcome to the libary!');
});

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

app.get('/books/:code', (req, res) => {
    const bookCode = parseInt(req.params.code);
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
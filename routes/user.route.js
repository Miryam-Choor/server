import { Router } from 'express';
import { users } from '../users.db.js';

const router = Router();

// all users
router.get('/', (req, res) => {
    res.json(users);
});

// sign-up
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    const existingUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        borrowedBooks: []
    };

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// sign-in
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Sign in successful', user });
});

export default router;
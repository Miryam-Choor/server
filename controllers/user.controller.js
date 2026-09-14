// controllers/user.controller.js
import { users } from '../users.db.js';

// all users
export const getAllUsers = (req, res) => {
    res.json(users);
};

// sign-up
export const signUp = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        return next(new Error('Please provide username, email, and password'));
    }

    const existingUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        res.status(400);
        return next(new Error('User with this email already exists'));    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        borrowedBooks: []
    };

    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
};

// sign-in
export const signIn = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        return next(new Error('Please provide email and password'));
    }

    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
        res.status(401);
        return next(new Error('Invalid email or password'));
    }

    res.json({ message: 'Sign in successful', user });
};
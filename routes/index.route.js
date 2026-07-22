// routes/index.route.js
import { Router } from 'express';
import userRoutes from './user.route.js';
import bookRoutes from './book.route.js';

const mainRouter = Router();

mainRouter.use('/users', userRoutes);
mainRouter.use('/book', bookRoutes);

export default mainRouter;
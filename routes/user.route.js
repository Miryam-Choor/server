// routes/user.route.js
import { Router } from 'express';
import { getAllUsers, signUp, signIn } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/signup', signUp);
router.post('/signin', signIn);

export default router;
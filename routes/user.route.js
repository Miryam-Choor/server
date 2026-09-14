// routes/user.route.js
import { Router } from 'express';
import { getAllUsers, signUp, signIn } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { userSignUpSchema, userSignInSchema } from '../validators/validation.schemas.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/signup', validate(userSignUpSchema), signUp);
router.post('/signin', validate(userSignInSchema), signIn);

export default router;
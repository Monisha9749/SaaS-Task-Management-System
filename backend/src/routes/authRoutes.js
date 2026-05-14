import { Router } from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupRules, loginRules } from '../validations/authValidation.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.post('/signup', signupRules, validateRequest, signup);
router.post('/login', loginRules, validateRequest, login);

export default router;

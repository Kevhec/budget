import { Router } from 'express';
import { login, loginAsGuest, signUp } from '../controllers/user';
import saveUser from '../middleware/userAuth';

const router = Router();

// User creation route
router.post('/signup', saveUser, signUp);
router.post('/guest', loginAsGuest);
router.get('/login', login);

export default router;

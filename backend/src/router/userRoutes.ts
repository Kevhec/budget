import { Router } from 'express';
import {
  logIn, loginAsGuest, logOut, signUp,
} from '../controllers/user';
import saveUser from '../middleware/userAuth';

const router = Router();

// User creation route{
// router.get('/', getInfo)
router.post('/signup', saveUser, signUp);
router.post('/guest', loginAsGuest);
router.post('/logout', logOut);
router.get('/login', logIn);

export default router;

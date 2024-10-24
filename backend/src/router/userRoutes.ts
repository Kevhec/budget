import { Router } from 'express';
import {
  confirm,
  getInfo,
  logIn, loginAsGuest, logOut, signUp,
} from '../controllers/user';
import saveUser from '../middleware/userAuth';
import authenticate from '../middleware/authenticate';

const router: Router = Router();

// User creation route{
router.get('/', authenticate, getInfo);
router.post('/signup', saveUser, signUp);
router.post('/guest', loginAsGuest);
router.post('/logout', authenticate, logOut);
router.post('/login', logIn);
router.post('/confirm/:token', confirm);

export default router;

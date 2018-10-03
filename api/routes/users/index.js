import { Router } from 'express';
const router = Router();

import isLoggedIn from '../../helpers/isLoggedIn';
import register from './register';
import confirm from './confirm';
import { login, logout } from './sessions';

/* Register new users */
router.post('/register', register);

/* Confirmation URL for new users */
router.get('/confirmation/:user_id/:confirmation_code_param', confirm);

/* Login */
router.post('/login', login);

/* Logout */
router.get('/logout', isLoggedIn, logout);

export default router;

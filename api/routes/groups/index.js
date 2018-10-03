import { Router } from 'express';
const router = Router();

import newGroupRoute from './newGroupRoute';

router.get('/new/:user_id', newGroupRoute);

export default router;
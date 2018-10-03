import { Router } from 'express';
const router = Router();

import newEntry from './newEntry';
import updateCurrentEntry from './updateCurrentEntry';

/* Create new entry */
router.get('/:user_id/new/:type', newEntry);

/* Update entry without finalizing */
router.post('/:user_id/update/:entry_id', updateCurrentEntry);

export default router;
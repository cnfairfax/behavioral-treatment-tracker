import { Router } from 'express';

import create from './createLocation';
import getById from './getById';
import getAllForAccount from './getAllForAccount'

const router = Router();

/* Create New Location */
router.post('/create', create);

/* Get Location By Id */
router.get('/one/id/:location_id_param', getById);

/* Get Locations for Account */
router.get('/all', getAllForAccount);

export default router;
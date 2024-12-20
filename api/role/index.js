import { Router } from 'express'
import {getRoles, createRole} from './roleController.js'

const router = Router();

router.use('/get-roles', getRoles);
router.use('/create-role', createRole);

export default router;
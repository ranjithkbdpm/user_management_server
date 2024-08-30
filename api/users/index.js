import { Router } from 'express'
import {login, signUp} from './userController.js'

const router = Router();

router.use('/login',login);
router.use('/signup',signUp);

export default router;
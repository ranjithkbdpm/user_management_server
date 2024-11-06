import { Router } from 'express'
import {login, signUp, logout} from './authController.js'
import handleRefreshToken from './refreshTokenController.js'

const router = Router();

router.use('/login',login);
router.use('/signup',signUp);
router.use('/logout', logout)
router.use('/refresh-accesstoken',handleRefreshToken);

export default router; 
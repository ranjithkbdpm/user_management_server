import { Router } from 'express';
import users from './users/index.js'
import auth from './auth/index.js'
import role from './role/index.js'
import { verifyJWTAccess } from '../middleware/verifyJWT.js';

const router = Router();

// router.get('/', (req, res) => { res.send('User endpoint');});
// router.use('/', (req, res)=>{ res.send('working')});

// Define unprotected route here
router.use('/auth', auth);

// Middleware that checks the jwt token from request 
router.use(verifyJWTAccess);

router.use('/check-access', (req, res)=>{ res.send('Middleware successfully verifies the accesstoken before sending the resource requested for a specific route by the client. the request is made with header file with authorisation and  Bearer accesstoken')});

// Define Protected route here.These routes are verified with jwt access token.
router.use('/users', users);
router.use('/role', role);
// router.use('/users',verifyJWTAccess, users); // middleware usage

export default router;  // Make sure to export the router

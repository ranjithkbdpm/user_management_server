import { Router } from 'express';
import users from './users/index.js'
import auth from './auth/index.js'
import role from './role/index.js'

const router = Router();
// const router = express.Router();

// Define your routes here
// router.get('/', (req, res) => {
//   res.send('User endpoint');
// });

// router.use('/', (req, res)=>{ res.send('working')});
router.use('/users', users);
router.use('/auth', auth);
router.use('/role', role);
export default router;  // Make sure to export the router

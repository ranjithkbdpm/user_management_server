import { Router } from 'express';
import users from './users/index.js'

const router = Router();
// const router = express.Router();

// Define your routes here
// router.get('/', (req, res) => {
//   res.send('User endpoint');
// });

// router.use('/', (req, res)=>{ res.send('working')});
router.use('/user', users);
export default router;  // Make sure to export the router

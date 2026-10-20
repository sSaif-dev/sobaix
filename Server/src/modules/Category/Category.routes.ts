import express from 'express'
import { requireLogin } from '../../middlewares/auth.middleware';
import { addCategory } from './Category.controller';

const router = express.Router();

router.post('/',requireLogin,addCategory)


export default router;
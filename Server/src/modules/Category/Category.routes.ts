import express from 'express'
import { requireLogin } from '../../middlewares/auth.middleware';
import { addCategory, getAllCategories, updateCategory } from './Category.controller';

const router = express.Router();

router.get('/',requireLogin,getAllCategories)
router.put('/',requireLogin,updateCategory)
router.post('/',requireLogin,addCategory)



export default router;
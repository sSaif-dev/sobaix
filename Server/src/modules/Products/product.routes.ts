import express from 'express'
import { addProduct, updateProduct } from './product.controller';
import { requireLogin } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/',requireLogin,addProduct)
router.patch('/:id',requireLogin,updateProduct)


export default router;
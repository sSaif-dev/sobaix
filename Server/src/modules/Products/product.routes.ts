import express from 'express'
import { addProduct } from './product.controller';
import { requireLogin } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/',requireLogin,addProduct)


export default router;
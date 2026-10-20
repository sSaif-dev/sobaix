import express from 'express'
import { Login, SignUp } from './Auth.controller';

const router = express.Router(); 

router.post('/login',Login);
router.post('/signup',SignUp);


export default router;


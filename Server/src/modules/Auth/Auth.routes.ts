import express from 'express'
import { Login, refreshAccessToken, SignUp } from './Auth.controller';

const router = express.Router(); 

router.post('/login',Login);
router.post('/signup',SignUp);
router.post('/refresh', refreshAccessToken)

export default router;


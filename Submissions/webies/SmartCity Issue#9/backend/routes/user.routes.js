import { Router } from 'express';
import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
import { handleUserLogin, handleUserRegister } from '../controllers/user.controllers.js';

const router = Router();


router.post('/login', handleUserLogin);
router.post('/register', handleUserRegister);


export default router;
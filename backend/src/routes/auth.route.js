import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
const router = express.Router();

router.get('/signup', (req, res)=>{
    signup(req, res);
}
);
router.get('/login', (req, res)=>{
    login(req, res);
});
router.get('/logout', (req, res)=>{
    logout(req, res);
});

export default router;
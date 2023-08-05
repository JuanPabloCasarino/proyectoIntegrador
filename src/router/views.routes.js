import { Router } from 'express';
import passport from 'passport';
import {
    privateRoute,
    publicRoute,
    getRegister,
    postRegister,
    failRegister,
    getLogin,
    postLogin,
    failLogin,
    getProfile,
    logout,
    current,
    loggerTesting
} from '../controllers/views.controller.js';


const router = Router();

router.get('/register', publicRoute, getRegister )

router.post('/register',passport.authenticate('register', {failureRedirect:'failRegister'}), publicRoute, postRegister)

router.get('/failRegister', failRegister)

router.get('/login', publicRoute, getLogin);

router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin' }), publicRoute, postLogin);


router.get('/failLogin', failLogin)

router.get('/profile', privateRoute, getProfile);

router.get('/logout', privateRoute, logout);

router.get('/current', passport.authenticate('jwt', {session: false}), current)

router.get('/loggerTest', loggerTesting);


export default router;
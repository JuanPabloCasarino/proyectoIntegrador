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
    loggerTesting,
    passwordRecover,
    recoverPassword,
    resetPassword,
    changeRol,
    updateDocs,
    getUsers,
    deleteUsers} from '../controllers/views.controller.js';

import { uploader } from '../middlewares/multer.js';

import { isUserOrTokenValid } from '../middlewares/userVerification.js';

const router = Router();


//Registro y login de user
router.get('/register', publicRoute, getRegister )

router.post('/register',passport.authenticate('register', {failureRedirect:'failRegister'}), publicRoute, postRegister)

router.get('/failRegister', failRegister)

router.get('/login', publicRoute, getLogin);

router.post('/login', passport.authenticate('login', { failureRedirect: 'failLogin' }), publicRoute, postLogin);

router.get('/failLogin', failLogin)

router.get('/profile', privateRoute, getProfile);

router.get('/logout', privateRoute, logout);

router.get('/current', passport.authenticate('jwt', {session: false}), current)
/////////////////////////
//Reseteo de contraseña
router.get('/passwordRecover', passwordRecover);

router.get('/recoverPassword', recoverPassword);

router.post('/recoverPassword', isUserOrTokenValid ,resetPassword);
////////////////////////////
//Testeo adicional
router.get('/loggerTest', loggerTesting);

router.get('/premium/:uid', changeRol)

router.post('/:uid/documents',  uploader.single('file'), updateDocs)

router.get('/getUsers', getUsers)

router.delete('/delete', deleteUsers)



export default router;
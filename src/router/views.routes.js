import { Router } from 'express';
import passport from 'passport';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import initializePassport from '../config/passport.config.js'


const router = Router();

// Middleware para validar rutas privadas
const privateRoute = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};
// Middleware para validar rutas públicas
const publicRoute = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/profile');
    }
};

router.get('/register', publicRoute, (req,res)=>{
    res.render('register', { title: "Express" })
})

router.post('/register',passport.authenticate('register', {failureRedirect:'failRegister'}), publicRoute, async (req,res)=>{
    res.redirect('/login');
})
router.get('/failRegister', async (req, res) => {
    console.log('Failed Strategy');
    res.send({error:'Failed'})
})

router.get('/login', publicRoute, (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin' }), publicRoute, async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });}

    const { firstname, lastname, age, email, rol } = req.user;
    req.session.user = {
        firstname,
        lastname,
        age,
        email,
        rol
    };
    console.log("Bienvenido, has entrado a tu perfil");
    res.redirect('profile');
});


router.get('/failLogin', async (req, res) => {
    console.log('Failed login');
    res.send({error:'Failed'})
})

router.get('/profile', privateRoute, (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const { firstname, lastname, email, age, rol } = req.session.user;
        res.render('profile', { firstname, lastname, email, age, rol });
    }
});

router.get('/logout', privateRoute, (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


export default router;
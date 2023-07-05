import { Router } from 'express';
import passport from 'passport';
// import jwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
import initializePassport from '../config/passport.config.js'

const router = Router();
const secretOrKey = 'coderSecret';

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
     req.session.user = req.user;
    const {email, password} =req.body;
    const token = jwt.sign({email, password}, secretOrKey, {expiresIn:'1h'});
    res.cookie('coderCookieToken', token, {maxAge:60*60*1000, httpOnly:true}).redirect('profile');;
    console.log("Bienvenido, has entrado a tu perfil");
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

router.get('/current', passport.authenticate('jwt', {session: false},(req, res) => {
    res.send(req.user);
}))


export default router;
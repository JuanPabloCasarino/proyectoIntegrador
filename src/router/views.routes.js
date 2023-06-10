import { Router } from 'express';
import UserModel from '../dao/models/user.model.js';

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

router.get('/', publicRoute, (req,res)=>{
    res.render('register', { title: "Express" })
})

router.post('/', publicRoute, async (req,res)=>{
    const { firstname, lastname, email, age, password } = req.body;
    if(!firstname || !lastname || !email || !age || !password ){
        console.log("Faltan campos obligatorios por ingresar");
    }
    console.log(firstname, lastname, email);
    const userEx = await UserModel.findOne({email});
    if( userEx ) {
        console.error('Error, el usuario ya esta registrado');
        res.redirect('/');
    }
    try {
        const user = new UserModel({ firstname, lastname, email, age, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.redirect('/');
    }
})

router.get('/login', publicRoute, (req, res) => {
    res.render('login');
});

router.post('/login', publicRoute, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            res.redirect('/login');
        } else {
            req.session.user = user;
            res.redirect('/profile');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.redirect('/login');
    }
});


router.get('/profile', privateRoute, (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const { firstname, lastname, email, age } = req.session.user;
        res.render('profile', { firstname, lastname, email, age });
    }
});

router.get('/logout', privateRoute, (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;
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

router.post('/register', publicRoute, async (req,res)=>{
    const { firstname, lastname, age, email, password } = req.body;
    if(!firstname || !lastname ||  !age || !email  || !password ){
        console.log("Faltan campos obligatorios por ingresar");
    }
    const userEx = await UserModel.findOne({email});
    if( userEx ) {
        console.error('Error, el usuario ya esta registrado');
        res.redirect('/');
    }
    try {
        const user = new UserModel({ firstname, lastname, age, email,  password, rol:"usuario" });
        await user.save();
        console.log("Usuario "+email+" registrado con exito")
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
        const { firstname, lastname, email, age, rol } = req.session.user;
        res.render('profile', { firstname, lastname, email, age, rol });
    }
});

router.get('/logout', privateRoute, (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;
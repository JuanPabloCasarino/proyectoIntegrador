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

router.get('/', publicRoute, (req,res)=>{
    res.render('register', { title: "Express" })
})

router.post('/register',passport.authenticate('register', {failureRedirect:'failRegister'}), publicRoute, async (req,res)=>{
    /*const { firstname, lastname, age, email, password } = req.body;
    if(!firstname || !lastname ||  !age || !email  || !password ){
        console.log("Faltan campos obligatorios por ingresar");
    }
    const userEx = await UserModel.findOne({email});
    if( userEx ) {
        console.error('Error, el usuario ya esta registrado');
        res.redirect('/');
    }
    try {
        const user = new UserModel({ firstname, lastname, age, email,  password:createHash(password), rol:"usuario" });
        await user.save();
        console.log("Usuario "+email+" registrado con exito")
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.redirect('/');
    }
    */
    res.redirect('/login');
})
router.get('/failRegister', async (req, res) => {
    console.log('Failed Strategy');
    res.send({error:'Failed'})
})

router.get('/login', publicRoute, (req, res) => {
    res.render('login');
});

router.post('/login',passport.authenticate('login',{failureRedirect:'/failLogin'}), publicRoute, async (req, res) => {
    /*
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log("Este usuario no existe");
            res.redirect('/login');
        } else if(!isValidPassword(user, password)) {
            console.log("Contrasena incorrecta");
            res.redirect('/login');
        } else{
            req.session.user = user;
            console.log("Bienvenido, has entrado a tu perfil");
            res.redirect('/profile');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.redirect('/login');
    }
    */
   if(!req.user) return res.status(400).send({status:'error', error:'Invalid credentials'});
   req.session.user = {
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    age: req.user.age,
    email: req.user.email,
    rol: req.user.rol
   }
   console.log("Bienvenido, has entrado a tu perfil");
    res.redirect('/profile', {payload:req.user});
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
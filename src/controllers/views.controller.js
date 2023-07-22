import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
import initializePassport from '../config/passport.config.js'
import {passportCall} from '../utils.js';
import config from '../config/config.js';

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

const getRegister = (req, res) => {
    res.render('register', {
        title: "Express"
    })
}
const postRegister = async (req, res) => {
    res.redirect('/login');
}
const failRegister = async (req, res) => {
    console.log('Failed Strategy');
    res.send({
        error: 'Failed'
    })
}

const getLogin = (req, res) => {
    res.render('login');
}
const postLogin = async (req, res) => {
    req.session.user = req.user;
    const {
        email,
        password
    } = req.body;
    const token = jwt.sign({
        email,
        password
    }, config.secretOrKey, {
        expiresIn: '1h'
    });
    res.cookie('coderCookieToken', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).redirect('profile');
    console.log("Bienvenido, has entrado a tu perfil");
}
const failLogin = async (req, res) => {
    console.log('Failed login');
    res.send({
        error: 'Failed'
    })
}
const getProfile = (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const {
            firstname,
            lastname,
            email,
            age,
            rol
        } = req.session.user;
        res.render('profile', {
            firstname,
            lastname,
            email,
            age,
            rol
        });
    }
}
const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}
const current = (req, res) => {
    res.status(200).send(req.user);
}

export {
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
    current
}
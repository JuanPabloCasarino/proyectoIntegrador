//Imports de librerias y DAO
import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserModel from '../dao/models/user.model.js';
//Imports de middlewares
import initializePassport from '../config/passport.config.js'
import {passportCall} from '../utils.js';
import config from '../config/config.js';
import { userDto } from '../DTO/userDto.js';
// Imports de Custom errors
import customError from '../services/errors/CustomError.js';
import EErors from '../services/errors/enum.js';
import { generateUserErrorInfo } from '../services/errors/info.js';
import log from '../config/loggers/customLogger.js';

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
    const { firstname, lastname, email } = req.body;
    try {
        if(!firstname || !lastname || !email){
            customError.createError({
                name: "User Creation Error",
                cause: generateUserErrorInfo({firstname, lastname, email}),
                message: "Error trying to create user",
                code:EErors.INVALID_TYPE_ERROR
            })
        }
        res.redirect('/login');
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
    
}
const failRegister = async (req, res) => { 
    log.warn('Failed Strategy');
    res.send({
        error: 'Failed'
    })
}

const getLogin = (req, res) => {
    res.render('login');
}
const postLogin = async (req, res) => {
    req.session.user = req.user;
    const {email,password} = req.body;
    const token = jwt.sign({email,password}, config.secretOrKey, {
        expiresIn: '1h'
    });
    try {
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).redirect('profile');
        log.debug("Bienvenido, has entrado a tu perfil");
        
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}
const failLogin = async (req, res) => {
    log.warn('Failed login');
    res.send({
        error: 'Failed'
    })
}
const getProfile = async (req, res) => {
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
        try {
            res.render('profile', {
                firstname,
                lastname,
                email,
                age,
                rol
            });
            
        } catch (error) {
            log.error(error);
            res.status(500).json({error:error.message});
        }
    }
}
const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}
const current = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        const userResponse = await userDto(req.session.user)
        res.status(200).send(userResponse);
    }
    
}

const loggerTesting = async (req, res) => {
    try{
        log.debug('Debug log Testing');
        log.http('HTTP log Testing');
        log.info('Info log Testing');
        log.warn('Warning log Testing');
        log.error('Error log Testing');
        res.json("Probando logs")
    }catch(e){
        log.fatal('Fatal log Testing');
    }
    

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
    current,
    loggerTesting
}
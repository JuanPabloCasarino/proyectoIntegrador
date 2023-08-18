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
import { createHash, generateToken, validateToken } from '../utils/validation.utils.js';
import { sendRecoverPassword } from '../utils/mail.utils.js';
// Imports de Custom errors
import customError from '../services/errors/CustomError.js';
import EErors from '../services/errors/enum.js';
import { generateUserErrorInfo } from '../services/errors/info.js';
import log from '../config/loggers/customLogger.js';

import userServicesDB from '../services/userServices.js';
const users = new userServicesDB();

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
    const {email, rol} = req.user;
    const token = generateToken(email, rol);
    try {
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).redirect('profile');
        log.debug("Bienvenido, has entrado a tu perfil");
        
    } catch (error) {
        log.error(error);
        res.status(500).json({Error:error.message});
    }
}
const failLogin = async (req, res) => {
    log.warn('Failed login');
    res.send({
        error: 'Failed'
    })
}
const getProfile = async (req, res) => {
    req.session.user = req.user;
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
    res.redirect('/users/login');
}
const current = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/users/login');
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

const passwordRecover = async (req, res) => {

    if (!req.user) {
        log.warn('Tienes que estar logueado para entrar a esta ruta')
        res.redirect('/users/login');
    } else{
        const { email } = await req.user;
        if(!email) {
            return res.status(404).send("Email no enviado");
        }
    
        try {
            const user = await users.getUserByEmail(email);
            
            if(!user) {
                return res.status(404).send("Usuario no existente!");
            }
    
            const token = generateToken(email);
            sendRecoverPassword(email, token);
            res.status(200).send("Reseto de contraseña enviada!");
        } catch (e) {
            console.log("Error: ", e);
            res.status(500).send("Error interno!");
        }
    }   
}

const recoverPassword = (req, res) => {
    const { token } = req.query;
    const { email } = req.body;
    try {
        const checkToken = validateToken(token);
        if(!checkToken) {
            console.log("Invalid token");
            return res.status(401).send("Acceso denegado!");
        }
        const newToken = generateToken(email);           
        res.render('resetPass')

    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error interno!");
    }

}

const resetPassword = async (req, res) => {
    const { email, password} = req.body;

    try {
        const hashedPassword = await createHash(password);
        await users.updatePasswordByEmail(email, hashedPassword);

       res.render('passReset')
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).send("Error interno!");
    }
    
}
const changeRol = async (req, res) => {
    const {uid}= req.params;

    const user = await users.getUserByID(uid)
    const {firstname, lastname, email, age, password, rol, carts}= user;

    try {
         if(rol==="premium"){
            const newRol = {
                firstname:firstname,
                lastname:lastname,
                email:email,
                age:age,
                passport:password,
                rol: "user",
                carts:carts
           }
            users.updateUserById(uid, newRol)
            res.status(200).send("Rol cambiado correctamente a user ")
            }else if(rol==="user"){
                 const newRol = {
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    age:age,
                    passport:password,
                    rol: "premium",
                    carts:carts
               }
            users.updateUserById(uid, newRol)
            res.status(200).send("Rol cambiado correctamente a premium")
            }else{
                res.status(500).send("No puedes cambiar de admin a otro user")
            }
        } catch (error) {
            log.error(error);
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
    loggerTesting,
    passwordRecover,
    recoverPassword,
    resetPassword,
    changeRol
    }
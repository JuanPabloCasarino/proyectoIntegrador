import passport from 'passport';
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js';
import {createHash,isValidPassword} from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import config from './config.js';
import customError from '../services/errors/CustomError.js';
import EErors from '../services/errors/enum.js';
import { generateUserErrorInfo } from '../services/errors/info.js';
import { stringify } from 'uuid';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    const cookieExtractor = req =>{
        let token = null;
        if (req && req.cookies){
            token = req.cookies['coderCookieToken']
        } 
        return token;
    }
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:config.secretOrKey,
    }, async (jwt_payload, done)=>{
        try{ 
            return done(null, jwt_payload);
        }
        catch(err){
            return done(err);
        }
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {firstname,lastname,email,age,} = req.body;
        try {
            let user = await UserModel.findOne({
                email: username
            })
            if (user) {
                console.log('El usuario ya existe');
                return done(null, false)
            }
            const newUser = {
                firstname,
                lastname,
                email,
                age,
                password: createHash(password),
                rol: 'usuario',
            }
            
            let result = await UserModel.create(newUser)
            return done(null, result)
        } catch (e) {
            let errors = []
            if(!firstname || !lastname || !email){
                 const error = customError.createError({
                    name: "User Creation Error",
                    cause: generateUserErrorInfo({firstname, lastname, email}),
                    message: "Error trying to create user",
                    code:EErors.INVALID_TYPE_ERROR
                })
                errors.push(error)
            }
            return done(errors)
        }
    }))

    passport.serializeUser ((user, done) => {
        console.log(user)
        done(null, user._id)
    })
    passport.deserializeUser (async (id, done) => {
        let user = await UserModel.findById(id)
        done(null, user)
    }) 
    
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({email: username});
            if (!user) {
                console.log('User does not exist')
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
    passport.use('github', new GitHubStrategy({
        clientID: config.clientID,
        clientSecret:config.clientSecret,
        callbackURL: config.callbackURL
    }, async (accessToken, refreshToken,profile, done) => {
        try{
            console.log(profile);
            let user = await UserModel.findOne({email:profile._json.name})
            if (!user){
                const  email = profile._json.email ? profile.json.email : "Not mail";
                const newUser = {
                    firstname:profile._json.name,
                    lastname:'',
                    email,
                    age:20,
                    password:'',
                    rol: 'usuario',
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            }
        } catch (error){
            return done(error);
        }
    }))  
}

export default initializePassport;
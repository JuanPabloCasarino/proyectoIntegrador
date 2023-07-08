import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-jwt';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateToken = (user)=>{
    const token = jwt.sign({user},config.privateKey,{expiresIn:'1min'})
    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({
        error: 'Not Authenticated'
    })
    const token = authHeader.split('')[1];
    jwt.verify(token,config.privateKey,(error,credentials)=>{
        if(error) res.status(403).send({error:"Not authorized"})
        req.user = credentials.user;
        next();
    })
}

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            req.user = user;
            next();
        }) (req, res, next);
    }
}



export {__dirname, generateToken, authToken, passportCall};
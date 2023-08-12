import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const generateToken = (user) => jwt.sign( {user}, config.token, {expiresIn: '1h'});

const validateToken = (token) => jwt.verify(token, config.token, (err) => err ? false : true);

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export {
    generateToken,
    validateToken,
    createHash
}
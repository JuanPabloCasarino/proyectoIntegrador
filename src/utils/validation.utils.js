import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const generateToken = (email, rol) => jwt.sign( {email, rol}, config.token, {expiresIn: '1h'});

const validateToken = (token) => jwt.verify(token, config.token, (err) => err ? false : true);

const decodeToken = (token) => {
    const secretKey = config.token; 
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  };

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export {
    generateToken,
    validateToken,
    createHash,
    decodeToken
}
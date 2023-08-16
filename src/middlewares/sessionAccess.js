import log from "../config/loggers/customLogger.js";
import {validateToken, decodeToken} from "../utils/validation.utils.js"
import jwt from 'jsonwebtoken';

const  isCapable = async (req, res, next) => {

  const token = await req.cookies.coderCookieToken
  const decodedToken = await decodeToken(token)
  const {rol}= decodedToken;
  
  if (rol === 'admin') {
    log.warn("Has creado el producto como admin")
    next();
  } else if (rol == 'premium') {
    log.warn("Has creado el producto como Premium")
    next();
  }else if(rol !== 'admin' && rol !== 'premium') {
    log.warn("No tienes los permisos necesarios")
    return res.status(403).json({ error: 'Access denied. Admin or Premium users only.' });
  }

}

const  isUser = async (req, res, next) => {
  const rol = await req.headers.rol; 

  if (rol !== 'usuario') {
    log.warn("No tienes los permisos necesarios")
    return res.status(403).json({ error: 'Access denied. Users only.' });
  }

  next();
}

export {isCapable, isUser};

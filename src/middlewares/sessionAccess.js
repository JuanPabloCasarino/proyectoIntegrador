import log from "../config/loggers/customLogger.js";
import {validateToken, decodeToken} from "../utils/validation.utils.js"
import jwt from 'jsonwebtoken';

const  isCapable = async (req, res, next) => {
  //Destokenizo el token para tomar la info del usario de adentro
  const token = await req.cookies.coderCookieToken
  if (!token) {
    return res.status(403).json({ error: 'Access denied. JWT must be provided' });
  }
  const decodedToken = await decodeToken(token)
  const {rol}= decodedToken;
  
  if (rol === 'admin') {
    log.warn("Has iniciado como admin")
    next();
  } else if (rol == 'premium') {
    log.warn("Has iniciado como  Premium")
    next();
  }else if(rol !== 'admin' && rol !== 'premium') {
    log.warn("No tienes los permisos necesarios")
    return res.status(403).json({ error: 'Access denied. Admin or Premium users only.' });
  }

}

export {isCapable};

import log from "../config/loggers/customLogger.js";

const  isCapable = async (req, res, next) => {
  const rol = await req.headers.rol; 
  const email = await req.headers.email

  if (rol == 'admin') {
    log.warn("Has creado el producto como admin")
    next();
  } else if (rol == 'premium') {
    log.warn("Has creado el producto como Premium")
    next(email);
  }
  if(rol !== 'admin' && rol !== 'premium') {
    log.warn("No tienes los permisos necesarios")
    return res.status(403).json({ error: 'Access denied. Admin or Premium only.' });
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


const  isAdmin = async (req, res, next) => {
  const user = await req.user; 

  if (!user || user.rol !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
}

const  isUser = async (req, res, next) => {
  const user = await req.user; 

  if (!user || user.rol !== 'usuario') {
    return res.status(403).json({ error: 'Access denied. Users only.' });
  }

  next();
}
 
export default {isAdmin, isUser};

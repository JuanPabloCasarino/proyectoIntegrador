
function isAdmin(req, res, next) {
  const user = req.user; 

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
}

function isUser(req, res, next) {
  const user = req.user; 

  if (!user || user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied. Users only.' });
  }

  next();
}
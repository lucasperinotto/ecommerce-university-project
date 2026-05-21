const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.usuario = {
            id: payload.id,
            rol: payload.rol
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Se requiere rol admin' });
    }
    next();
};

const isOwnerOrAdmin = (req, id) => {
    return req.usuario && (req.usuario.rol === 'admin' || req.usuario.id === id);
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    isOwnerOrAdmin
};
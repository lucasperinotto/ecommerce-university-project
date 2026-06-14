const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Endpoint Login
const login = async (req, res) => {
    const { mail, contrasena } = req.body;

    if (!mail || !contrasena) {
        return res.status(400).json({ error: 'El mail y la contraseña son obligatorios.' });
    }

    try {
        const usuario = await Usuario.findOne({ mail });
        if (!usuario) {
            return res.status(401).json({ error: 'El correo electrónico ingresado no tiene un usuario asociado.' });
        }

        const igual = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!igual) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const payload = { id: usuario._id.toString(), rol: usuario.rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.json({ token, usuario });
    } catch (err) {
        console.error('Error en login', err);
        res.status(500).json({ error: 'Error interno' });
    }
}

module.exports = {
    login 
};
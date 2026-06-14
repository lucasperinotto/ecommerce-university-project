const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Usuario = require('../models/Usuario');

const {
    sendPasswordResetEmail
} = require('../mailer.js')

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
        console.error('Error en login.', err);
        res.status(500).json({ error: 'Error interno.' });
    }
}

// Endpoint Forgot Password
const forgotPassword = async (req, res) => {
    const { mail } = req.body;

    if (!mail) {
        return res.status(400).json({ error: 'Ingrese un correo electrónico válido.' });
    }

    try {
        const usuario = await Usuario.findOne({ mail });
        if (!usuario) {
            return res.status(200).json({mensaje: 'Se enviará un enlace de recuperación al correo electrónico ingresado.'});
        }

        const token = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        usuario.resetPasswordToken = tokenHash;
        usuario.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await usuario.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await sendPasswordResetEmail({
            to: usuario.mail,
            resetURL
        });

        return res.status(200).json({mensaje: 'Se enviará un enlace de recuperación al correo electrónico ingresado.'});
    } catch (err) {
        console.error('Error al recuperar contraseña.', err);
        console.log(err);
        res.status(500).json({ error: 'Error interno.' });
    }
}

module.exports = {
    login, 
    forgotPassword 
};
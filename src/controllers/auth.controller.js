const Usuario = require('../models/Usuario');

// Endpoint Login
const login = async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const igual = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!igual) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const payload = { id: usuario._id.toString(), rol: usuario.rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.json({ token });
    } catch (err) {
        console.error('Error en login', err);
        res.status(500).json({ error: 'Error interno' });
    }
}

module.exports = {
    login 
};
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

// Endpoint "Obtener todos los Usuarios"
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-__v");
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
};

// Endpoint "Obtener un Usuario por ID"
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-__v");
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.'});
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
};

// Endpoint "Crear Usuario"
const crearUsuario = async (req, res) => {
    const {nombre, apellido, mail, contrasena, confirmar} = req.body;
    if (!nombre || !apellido || !mail || !contrasena || !confirmar) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    if (mail.length < 10 || !mail.includes('@')) {
        return res.status(400).json({ error: 'Ingrese un mail válido.' });
    }

    const usuario = await Usuario.findOne({ mail });
    if (usuario) {
        return res.status(401).json({ error: 'El correo electrónico ingresado ya está en uso.' });
    }

    if (contrasena.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (contrasena != confirmar) {
        return res.status(400).json({ error: 'La contraseñas no coinciden.' });
    }

    try {
        hash = await bcrypt.hash(contrasena, 12);

        const nuevoUsuario = new Usuario({
        nombre,
        apellido,
        mail,
        contrasena: hash
    });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario.' });
    }
};

// Endpoint "Actualizar Usuario"
const actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-__v");
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.'});
        }

        const {nombre, apellido} = req.body;
        if (!nombre || !apellido) {
            return res.status(400).json({ error: 'Faltan campos requeridos.' });
        }

        usuario.nombre = nombre;
        usuario.apellido = apellido;

        await usuario.save();
        res.json(usuario);
        } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
    }
}

// Endpoint "Agregar Direccion de Usuario"
const agregarDireccion = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-__v");
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.'});
        }

        const {calle, numero, ciudad, provincia, codigoPostal} = req.body;
        if (!calle || !numero || !ciudad || !provincia || !codigoPostal) {
            return res.status(400).json({ error: 'Faltan campos requeridos.' });
        }

        usuario.direcciones.calle = calle;
        usuario.direcciones.numero = numero;
        usuario.direcciones.ciudad = ciudad;
        usuario.direcciones.provincia = provincia;
        usuario.direcciones.codigoPostal = codigoPostal;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar dirección.' });
    }
}

// Endpoint "Baja Logica de Usuario"
const bajaLogicaUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-__v");
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.'});
        }

        usuario.estado = "inactivo";
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja al usuario.' });
    }
}

// Endpoint "Restaurar Usuario"
const restaurarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-__v");
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.'});
        }

        usuario.estado = "activo";
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al restaurar el usuario.' });
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    agregarDireccion,
    bajaLogicaUsuario,
    restaurarUsuario
}
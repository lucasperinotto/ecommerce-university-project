const usuarios = require("../data/usuarios.data.js");

// Endpoint "Obtener todos los Usuarios"
const obtenerUsuarios = (req, res) => {
    res.json(usuarios);
};

// Endpoint "Obtener un Usuario por ID"
const obtenerUsuarioPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(p => p.id == id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.'});
    }

    res.json(usuario);
};

// Endpoint "Crear Usuario"
const crearUsuario = (req, res) => {
    const {nombre, apellido} = req.body;
    if (!nombre || !apellido) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        apellido
    }

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
};

// Endpoint "Actualizar Usuario"
const actualizarUsuario = (req, res) => {
    const id = req.params.id;
    const usuario = usuarios.find(p => p.id == id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.'});
    }

    const {nombre, apellido} = req.body;
    if (!nombre || !apellido) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    usuario.nombre = nombre;
    usuario.apellido = apellido;

    res.json(usuario);
}

// Endpoint "Eliminar Usuario"
const eliminarUsuario = (req, res) => {
    const id = req.params.id;
    const index = usuarios.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.'});
    }

    usuarios.splice(index, 1);
    res.json(usuarios);
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}
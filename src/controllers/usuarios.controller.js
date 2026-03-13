const usuarios = require("../data/usuarios.data.json");

// Endpoint "Obtener Usuarios"
const obtenerUsuarios = (req, res) => {
    res.json(usuarios);
};

// Endpoint "Obtener Usuario por ID"
const obtenerUsuarioPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(p => p.id == id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.'});
    }

    res.json(usuario);
};

function cargarUsuarios() {
    try {
        const data = require(usuarios_json);
        return data;
    } catch (error) {
        console.error('Error al cargar usuarios: ', error);
        return [];
    }
}

function guardarUsuarios(usuarios) {
    try {
        const fs = require('fs');
        fs.writeFileSync(usuarios_json, JSON.stringify(usuarios, null, 2))
    } catch (error) {
        console.error('Error al guardar usuarios: ', error)
    }
}

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
    guardarUsuarios(usuarios);
    res.status(201).json(nuevoUsuario);
}

let usuarios = cargarUsuarios();

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

    guardarUsuarios(usuarios);
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
    guardarUsuarios(usuarios);

    res.json(usuarios);
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}
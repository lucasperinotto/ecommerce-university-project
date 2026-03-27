const usuarios = require("../data/usuarios.data.json");
const path = require('path');

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

function guardarUsuarios(usuarios) {
    try {
        const fs = require('fs');
        fs.writeFileSync(path.join(__dirname, '../data/usuarios.data.json'), JSON.stringify(usuarios, null, 2))
    } catch (error) {
        console.error('Error al guardar usuarios: ', error)
    }
}

// Endpoint "Crear Usuario"
const crearUsuario = (req, res) => {
    const {nombre, apellido, mail, contrasena} = req.body;
    if (!nombre || !apellido || !mail || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        apellido,
        mail,
        contrasena,
        direcciones: [
            {
                idDireccion: direcciones.length + 1,
                calle,
                numero,
                ciudad,
                provincia,
                codigoPostal
            }
        ],
        rol: "cliente",
        estado: "activo"
    }

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
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

    guardarUsuarios(usuarios);
    res.json(usuario);
}

// Endpoint "Baja Logica de Usuario"
const bajaLogicaUsuario = (req, res) => {
    const id = req.params.id;
    const index = usuarios.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.'});
    }

    usuarios[index].estado = "inactivo";
    guardarUsuarios(usuarios);
    res.json(usuarios);
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    bajaLogicaUsuario
}
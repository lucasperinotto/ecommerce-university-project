const productos = require('../data/productos.data.json');

// Endpoint "Obtener Producto"
const obtenerProductos = (req, res) => {
    res.json(productos);
};

// Endpoint "Obtener Producto por ID"
const obtenerProductoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    res.json(producto);
};

function cargarProductos() {
    try {
        const data = require(productos_json);
        return data;
    } catch (error) {
        console.error('Error al cargar productos: ', error);
        return [];
    }
}

function guardarProductos(productos) {
    try {
        const fs = require('fs');
        fs.writeFileSync(productos_json, JSON.stringify(productos, null, 2))
    } catch (error) {
        console.error('Error al guardar productos: ', error)
    }
}

// Endpoint "Crear Producto"
const crearProducto = (req, res) => {
    const {nombre, precio} = req.body;
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio
    }

    productos.push(nuevoProducto);
    guardarProductos(productos);
    res.status(201).json(nuevoProducto);
};

let productos = cargarProductos();

// Endpoint "Actualizar Producto"
const actualizarProducto = (req, res) => {
    const id = req.params.id;
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    const {nombre, precio} = req.body;
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    producto.nombre = nombre;
    producto.precio = precio;

    guardarProductos(productos);
    res.json(producto);
}

// Endpoint "Eliminar Producto"
const eliminarProducto = (req, res) => {
    const id = req.params.id;
    const index = productos.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    productos.splice(index, 1);
    guardarProductos(productos);

    res.json(productos);
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
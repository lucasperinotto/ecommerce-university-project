const productos = require('../data/productos.data.js');

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
    res.status(201).json(nuevoProducto);
};

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
    res.json(productos);
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
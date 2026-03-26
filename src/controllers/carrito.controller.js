const carritos = require('../data/carritos.data.js');

// Endpoint "Obtener un Carrito por ID de Usuario"
const obtenerCarritoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const carrito = carritos.find(c => c.id == id);

    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado.'});
    }

    res.json(carrito);
};

function guardarCarritos(carritos) {
    try {
        const fs = require('fs');
        fs.writeFileSync(carritos_json, JSON.stringify(carritos, null, 2))
    } catch (error) {
        console.error('Error al guardar carritos: ', error)
    }
}

// Endpoint "Crear Carrito"
const crearCarrito = (req, res) => {
const idCliente = parseInt(req.params.id);

    // verificacion de si el carrito ya existe

    const nuevoCarrito = {
        id: idCliente,
        productos: []
    }

    carritos.push(nuevoCarrito);
    guardarCarritos(carritos);
    res.status(201).json(nuevoCarrito);
}

// Endpoint "Agregar Producto a un Carrito"
const agregarProductoAlCarrito = (req, res) => {
    const id = parseInt(req.params.id);
    const carrito = carritos.find(c => c.id == id);
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado.'});
    }

    const {nombre, precio} = req.body;
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const productoAgregado = {
        idProductoCarrito: carrito.productos.length + 1,
        nombre,
        precio
    }

    carrito.productos.push(productoAgregado);
    guardarCarritos(carritos);
    res.status(201).json(productoAgregado);
};  

module.exports = {
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
}
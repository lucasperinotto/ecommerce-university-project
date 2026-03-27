const carritos = require('../data/carritos.data.json');
const path = require('path');

// Endpoint "Obtener un Carritos"
const obtenerCarritos = (req, res) => {
    res.json(carritos);
};

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
        fs.writeFileSync(path.join(__dirname, '../data/carritos.data.json'), JSON.stringify(carritos, null, 2))
    } catch (error) {
        console.error('Error al guardar carritos: ', error)
    }
}

// Endpoint "Crear Carrito"
const crearCarrito = (req, res) => {
    const idCliente = parseInt(req.params.id);

    const carritoExistente = carritos.find(c => c.id === idCliente);
    if (carritoExistente) {
        return res.status(400).json({ error: 'Este usuario ya tiene un carrito.'});
    }

    const nuevoCarrito = {
        id: idCliente,
        items: []
    }

    carritos.push(nuevoCarrito);
    guardarCarritos(carritos);
    res.status(201).json(nuevoCarrito);
}

// Endpoint "Agregar Producto a un Carrito"
const agregarProductoAlCarrito = (req, res) => {
    const id = parseInt(req.params.id);
    const carrito = carritos.find(c => c.id === id);
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado.'});
    }

    const {idProducto, nombre, precio, cantidad} = req.body;
    if (!idProducto || !nombre || !precio || !cantidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    let productoFinal;
    const productoExistente = carrito.items.find(item => item.idProducto === idProducto);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        productoFinal = productoExistente;
    } else {
            const productoAgregado = {
            idProductoCarrito: carrito.items.length + 1,
            idProducto,
            nombre,
            precio,
            cantidad
            } 
            carrito.items.push(productoAgregado);
            productoFinal = productoAgregado;
        }

    guardarCarritos(carritos);
    res.status(201).json(productoFinal);
};  

module.exports = {
    obtenerCarritos,
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
}
const Carrito = require('../models/Carrito');

// Endpoint "Obtener Carritos"
const obtenerCarritos = async (req, res) => {
    try {
        const carritos = await Carrito.find().select("-__v");
        res.json(carritos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos.' });
    }
};

// Endpoint "Obtener un Carrito por ID de Usuario"
const obtenerCarritoPorId = async (req, res) => {
    try {
        const carrito = await Carrito.findOne({ idUsuario: req.params.id }).select("-__v");
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
};

// Endpoint "Crear Carrito"
const crearCarrito = async (req, res) => {
    const carritoExistente = await Carrito.findOne({ idUsuario: req.params.id});
    if (carritoExistente) {
        return res.status(400).json({ error: 'Este usuario ya tiene un carrito.'});
    }

    try {
        const nuevoCarrito = new Carrito({
            idUsuario: req.params.id,
            items: []
        });
        await nuevoCarrito.save();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito.' });
    }
};

// Endpoint "Agregar Producto a un Carrito"
const agregarProductoAlCarrito = async (req, res) => {
    const carrito = await Carrito.findOne({ idUsuario: req.params.id });
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
            idProducto: idProducto,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        };
        productoFinal = productoAgregado;
    }

    await carrito.save();
    res.status(201).json(productoFinal);
};

module.exports = {
    obtenerCarritos,
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
}
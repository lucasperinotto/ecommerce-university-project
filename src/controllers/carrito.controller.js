const Carrito = require('../models/Carrito');
const { isOwnerOrAdmin } = require('../middlewares/auth.middleware');

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
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }
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
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }

    const carritoExistente = await Carrito.findOne({ idUsuario: req.params.id });
    if (carritoExistente) {
        return res.status(400).json({ error: 'Este usuario ya tiene un carrito.' });
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
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }

    const carrito = await Carrito.findOne({ idUsuario: req.params.id });
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    const { idProducto, nombre, precio, cantidad } = req.body;
    if (!idProducto || !nombre || !precio || !cantidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    if (precio <= 0) {
        return res.status(400).json({ error: 'Ingrese un monto válido.' });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ error: 'Ingrese una cantidad válida.' });
    }

    const productoExistente = carrito.items.find(item => item.idProducto.toString() === idProducto.toString());
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.items.push({ idProducto, nombre, precio, cantidad });
    }

    await carrito.save();
    res.status(201).json(carrito);
};

// Endpoint "Modificar Cantidad de un Producto del Carrito"
const modificarCantidadProducto = async (req, res) => {
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }

    const { cantidad } = req.body;
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: 'Ingrese una cantidad válida.' });
    }

    try {
        const carrito = await Carrito.findOne({ idUsuario: req.params.id });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        const item = carrito.items.find(i => i.idProducto.toString() === req.params.idProducto);
        if (!item) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }

        item.cantidad = cantidad;
        await carrito.save();
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar la cantidad.' });
    }
};

// Endpoint "Eliminar Producto del Carrito"
const eliminarProductoDelCarrito = async (req, res) => {
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }

    try {
        const carrito = await Carrito.findOne({ idUsuario: req.params.id });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        const cantidadPrevia = carrito.items.length;
        carrito.items = carrito.items.filter(i => i.idProducto.toString() !== req.params.idProducto);
        if (carrito.items.length === cantidadPrevia) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }

        await carrito.save();
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
};

// Endpoint "Vaciar Carrito"
const vaciarCarrito = async (req, res) => {
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }

    try {
        const carrito = await Carrito.findOne({ idUsuario: req.params.id });
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        carrito.items = [];
        await carrito.save();
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito.' });
    }
};

module.exports = {
    obtenerCarritos,
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito,
    modificarCantidadProducto,
    eliminarProductoDelCarrito,
    vaciarCarrito
}

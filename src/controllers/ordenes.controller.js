const Orden = require('../models/Orden');
const Usuario = require('../models/Usuario');

// Endpoint "Obtener Ordenes"
const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.find().select("-__v");
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes.' });
    }
};

// Endpoint "Obtener Ordenes por ID de Usuario"
const obtenerOrdenesPorUsuario = async (req, res) => {
    try {
        const orden = await Orden.findOne({ idUsuario: req.params.id }).select("-__v");
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la orden.' });
    }
};

// Endpoint "Generar Orden de Compra"
const generarOrden = async (req, res) => {
    const { direccionEnvio, items, precioTotal, metodoPago } = req.body;
    if (!direccionEnvio || !items || !precioTotal || !metodoPago) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const usuarioExistente = await Usuario.findById(req.params.id);
    if (!usuarioExistente) {
        return res.status(400).json({ error: 'Usuario no encontrado.'});
    }

    if (direccionEnvio.calle === '' || direccionEnvio.numero === '' || direccionEnvio.ciudad === '' || direccionEnvio.provincia === '' || direccionEnvio.codigoPostal === '') {
        return res.status(400).json({ error: 'Todos los campos de dirección de envío son obligatorios.' });
    }

    if (items.idProducto === '' || items.nombre === '' || items.precio === '' || items.cantidad === '') {
        return res.status(400).json({ error: 'Todos los campos de items son obligatorios.' });
    }

    if (precioTotal <= 0) {
        return res.status(400).json({ error: 'Ingrese un monto válido.' });
    }

    if (!metodoPago.includes(metodoPago)) {
        return res.status(400).json({ error: 'El método de pago debe ser "tarjeta", "paypal" o "efectivo".' });
    }

    try {
        const nuevaOrden = new Orden({
            idUsuario: usuarioExistente._id,
            direccionEnvio: req.body.direccionEnvio,
            items: req.body.items,
            precioTotal: req.body.precioTotal,
            metodoPago: req.body.metodoPago,
            estado: "pendiente de pago"
        });
        await nuevaOrden.save();
        res.status(201).json(nuevaOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al generar la orden.',
            detalle: error.message
    });
    }
}

module.exports = {
    obtenerOrdenes,
    obtenerOrdenesPorUsuario,
    generarOrden
}
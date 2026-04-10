const Orden = require('../models/Orden');
const metodosPago = ['tarjeta', 'paypal', 'efectivo'];

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
const obtenerOrdenPorUsuario = async (req, res) => {
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
    const { idUsuario, direccionEnvio, items, total, metodoPago } = req.body;
    if (!idUsuario || !direccionEnvio || !items || !total || !metodoPago) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    if (direccionEnvio.calle === '' || direccionEnvio.numero === '' || direccionEnvio.ciudad === '' || direccionEnvio.provincia === '' || direccionEnvio.codigoPostal === '') {
        return res.status(400).json({ error: 'Todos los campos de dirección de envío son obligatorios.' });
    }

    if (!metodosPago.includes(metodoPago)) {
        return res.status(400).json({ error: 'El método de pago debe ser "tarjeta", "paypal" o "efectivo".' });
    }

    try {
        const nuevaOrden = new Orden({
            idUsuario: req.body.idUsuario,
            direccionEnvio: req.body.direccionEnvio,
            items: req.body.items,
            precioTotal: req.body.total,
            metodoPago: req.body.metodoPago,
            estado: "pendiente de pago",
            fechaCreacion: new Date().toISOString()
        });
        await nuevaOrden.save();
        res.status(201).json(nuevaOrden);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar la orden.' });
    }
}

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorUsuario,
    generarOrden
}
const Orden = require('../models/Orden');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const { isOwnerOrAdmin } = require('../middlewares/auth.middleware');

// Endpoint "Obtener Ordenes"
const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.find().select("-__v").populate('idUsuario', 'nombre apellido mail');
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes.' });
    }
};

// Endpoint "Obtener Ordenes por ID de Usuario"
const obtenerOrdenesPorUsuario = async (req, res) => {
    if (!isOwnerOrAdmin(req, req.params.id)) {
        return res.status(403).json({ error: 'No autorizado.' });
    }
    try {
        const ordenes = await Orden.find({ idUsuario: req.params.id }).sort({ createdAt: -1 }).select("-__v");
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes.' });
    }
};

// Endpoint "Generar Orden de Compra"
const generarOrden = async (req, res) => {
    const { idUsuario, items, precioTotal, metodoPago, direccionEnvio, tipoEntrega } = req.body;

    if (!idUsuario || !items?.length || !precioTotal || !metodoPago) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const usuarioExistente = await Usuario.findById(idUsuario);
    if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (tipoEntrega === 'envio') {
        if (!direccionEnvio || !direccionEnvio.calle || !direccionEnvio.numero || !direccionEnvio.ciudad || !direccionEnvio.provincia || !direccionEnvio.codigoPostal) {
            return res.status(400).json({ error: 'Todos los campos de dirección de envío son obligatorios.' });
        }
    }

    const itemInvalido = items.some((i) => !i.idProducto || !i.nombre || !i.precio || !i.cantidad);
    if (itemInvalido) {
        return res.status(400).json({ error: 'Todos los campos de items son obligatorios.' });
    }

    if (precioTotal <= 0) {
        return res.status(400).json({ error: 'Ingrese un monto válido.' });
    }

    if (!['efectivo', 'transferencia', 'tarjeta', 'paypal'].includes(metodoPago)) {
        return res.status(400).json({ error: 'Método de pago inválido.' });
    }

    for (const item of items) {
        const producto = await Producto.findById(item.idProducto);
        if (!producto || producto.estado === 'inactivo') {
            return res.status(400).json({ error: `El producto "${item.nombre}" ya no está disponible.` });
        }
        if (producto.cantidad < item.cantidad) {
            return res.status(400).json({ error: `No hay suficiente stock de "${item.nombre}". Disponible: ${producto.cantidad}.` });
        }
    }

    try {
        const nuevaOrden = new Orden({
            idUsuario,
            tipoEntrega: tipoEntrega === 'envio' ? 'envio' : 'retiro',
            direccionEnvio: tipoEntrega === 'envio' ? direccionEnvio : undefined,
            items,
            precioTotal,
            metodoPago,
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

const ordenes = require('../data/ordenes.data.json');
const path = require('path');

// Endpoint "Obtener Ordenes"
const obtenerOrdenes = (req, res) => {
    res.json(ordenes);
};

// Endpoint "Obtener un Ordenes por ID de Usuario"
const obtenerOrdenPorUsuario = (req, res) => {
    const idUsuario = parseInt(req.params.id);
    const orden = ordenes.find(o => o.idUsuario === idUsuario);

    if (!orden) {
        return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(orden);
};

const guardarOrdenes = (ordenes) => {
    try {
        const fs = require('fs');
        fs.writeFileSync(path.join(__dirname, '../data/ordenes.data.json'), JSON.stringify(ordenes, null, 2));
    } catch (error) {
        console.error('Error al guardar las órdenes:', error);
    }
};

// Endpoint "Generar Orden de Compra"
const generarOrden = (req, res) => {
    const { idUsuario, direccionEnvio, items, total, metodoPago } = req.body;
    if (!idUsuario || !direccionEnvio || !items || !total || !metodoPago) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const nuevaOrden = {
        id: ordenes.length + 1,
        idUsuario: req.body.idUsuario,
        direccionEnvio: req.body.direccionEnvio,
        items: req.body.items,
        precioTotal: req.body.total,
        metodoPago: req.body.metodoPago,
        estado: "pendiente de pago",
        fechaCreacion: new Date().toISOString()
    };

    ordenes.push(nuevaOrden);
    guardarOrdenes(ordenes);
    res.status(201).json(nuevaOrden);
}

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorUsuario,
    generarOrden
}
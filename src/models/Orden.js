const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    direccionEnvio: {
        calle: { type: String, required: true },
        numero: { type: Number, required: true },
        ciudad: { type: String, required: true },
        provincia: { type: String, required: true },
        codigoPostal: { type: String, required: true }
    },
    items: [
        {
            idProducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            nombre: { type: String, required: true },
            precio: { type: Number, required: true, min: 0 },
            cantidad: { type: Number, required: true, min: 1 }
        }
    ],
    precioTotal: { type: Number, required: true, min: 0 },
    metodoPago: { type: String, enum: ['tarjeta', 'paypal', 'efectivo'], required: true },
    estado: { type: String, enum: ['pendiente de pago', 'procesando', 'enviado', 'entregado', 'cancelado'], default: 'pendiente de pago' }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
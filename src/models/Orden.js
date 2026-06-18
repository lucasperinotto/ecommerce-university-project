const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tipoEntrega: { type: String, enum: ['retiro', 'envio'], default: 'retiro' },
    direccionEnvio: {
        calle: { type: String, default: '' },
        numero: { type: Number, default: 0 },
        ciudad: { type: String, default: '' },
        provincia: { type: String, default: '' },
        codigoPostal: { type: String, default: '' }
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
    metodoPago: { type: String, enum: ['efectivo', 'transferencia', 'tarjeta', 'paypal'], required: true },
    estado: { type: String, enum: ['pendiente de pago', 'procesando', 'enviado', 'entregado', 'cancelado'], default: 'pendiente de pago' }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
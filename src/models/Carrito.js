const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    items: [
        {
            idProducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Carrito', carritoSchema);
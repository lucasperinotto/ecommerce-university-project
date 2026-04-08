const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            cantidad: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Carrito', carritoSchema);
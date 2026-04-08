const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: '' },
    precio: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 0 },
    categoria: { type: String, enum: ['anillos', 'aros', 'carteras', 'collares'], required: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
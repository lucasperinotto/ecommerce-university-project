const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    mail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasena: { type: String, required: true },
    direcciones: [
        {
            calle: { type: String, required: true },
            numero: { type: Number, required: true },
            ciudad: { type: String, required: true },
            provincia: { type: String, required: true },
            codigoPostal: { type: String, required: true }
        }
    ],
    rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
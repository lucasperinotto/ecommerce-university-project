const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    mail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasena: { type: String, required: true },
    direcciones: [
        {
            calle: { type: String, default: '' },
            numero: { type: Number, default: '' },
            ciudad: { type: String, default: '' },
            provincia: { type: String, default: '' },
            codigoPostal: { type: String, default: '' }
        }
    ],
    rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

app.use(express.json());

// Rutas
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);

module.exports = app;
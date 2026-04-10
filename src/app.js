const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const ordenesRoutes = require('./routes/ordenes.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const carritosRoutes = require('./routes/carrito.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/ordenes', ordenesRoutes);
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/carrito', carritosRoutes);

module.exports = app;

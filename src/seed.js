const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const productos = require('./data/productos.data.json');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Conectado a MongoDB');

  const existentes = await Producto.countDocuments();
  if (existentes > 0) {
    console.log(`Ya hay ${existentes} productos en la base de datos. No se cargaron duplicados.`);
    await mongoose.disconnect();
    return;
  }

  const productosNormalizados = productos.map((p) => ({
    ...p,
    imagen: Array.isArray(p.imagen) ? p.imagen[0] : p.imagen,
  }));
  const resultado = await Producto.insertMany(productosNormalizados);
  console.log(`✓ ${resultado.length} productos cargados correctamente.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});

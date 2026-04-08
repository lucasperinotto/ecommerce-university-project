const productos = require('../data/productos.data.json');
const path = require('path');

const Categoria = {
  ANILLOS: "anillos",
  AROS: "aros",
  CARTERAS: "carteras",
  COLLARES: "collares"
};

// Endpoint "Obtener Producto"
const obtenerProductos = (req, res) => {
    res.json(productos);
};

// Endpoint "Obtener Producto por ID"
const obtenerProductoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    res.json(producto);
};

function guardarProductos(productos) {
    try {
        const fs = require('fs');
        fs.writeFileSync(path.join(__dirname, '../data/productos.data.json'), JSON.stringify(productos, null, 2))
    } catch (error) {
        console.error('Error al guardar productos: ', error)
    }
}

// Endpoint "Crear Producto"
const crearProducto = (req, res) => {
    const {nombre, precio, cantidad, categoria, descripcion} = req.body;
    if (!nombre || !precio || !cantidad || !categoria || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    if (precio <= 0) {
        return res.status(400).json({ error: 'Ingrese un monto válido.' });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ error: 'Ingrese una cantidad válida.' });
    }

    if(!Object.values(Categoria).includes(categoria)) {
        return res.status(400).json({ error: 'La categoría ingresada no se encuentra dentro de las válidas (ANILLOS, AROS, CARTERAS, COLLARES).' });
    }

    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio,
        cantidad,
        categoria,
        descripcion,
        estado: "disponible"
    }

    productos.push(nuevoProducto);
    guardarProductos(productos);
    res.status(201).json(nuevoProducto);
};

// Endpoint "Actualizar Producto"
const actualizarProducto = (req, res) => {
    const id = req.params.id;
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    const {nombre, precio, cantidad, categoria, descripcion} = req.body;
    if (!nombre || !precio || !cantidad || !categoria || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    if (precio <= 0) {
        return res.status(400).json({ error: 'Ingrese un monto válido.' });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ error: 'Ingrese una cantidad válida.' });
    }

    if(!Object.values(Categoria).includes(categoria)) {
        return res.status(400).json({ error: 'La categoría ingresada no se encuentra dentro de las válidas (ANILLOS, AROS, CARTERAS, COLLARES).' });
    }

    producto.nombre = nombre;
    producto.precio = precio;
    producto.cantidad = cantidad;
    producto.categoria = categoria;
    producto.descripcion = descripcion;

    guardarProductos(productos);
    res.json(producto);
}

// Endpoint "Baja Logica de Producto"
const bajaLogicaProducto = (req, res) => {
    const id = req.params.id;
    const index = productos.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado.'});
    }

    productos[index].estado = "no disponible";
    productos[index].cantidad = 0;

    guardarProductos(productos);
    res.json(productos);
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    bajaLogicaProducto
}
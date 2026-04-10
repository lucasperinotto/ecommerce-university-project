const Producto = require('../models/Producto');
const Categoria = {
  ANILLOS: "anillos",
  AROS: "aros",
  CARTERAS: "carteras",
  COLLARES: "collares"
};

// Endpoint "Obtener Producto"
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().select("-__v");
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
};

// Endpoint "Obtener Producto por ID"
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).select("-__v");
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
};

// Endpoint "Crear Producto"
const crearProducto = async (req, res) => {
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
        return res.status(400).json({ error: 'La categoría ingresada no se encuentra dentro de las válidas (anillos, aros, carteras, collares).' });
    }

    try {
        const nuevoProducto = new Producto({
            nombre,
            precio,
            cantidad,
            categoria,
            descripcion
        });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
};


// Endpoint "Actualizar Producto"
const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).select("-__v");
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
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
            return res.status(400).json({ error: 'La categoría ingresada no se encuentra dentro de las válidas (anillos, aros, carteras, collares).' });
        }

        producto.nombre = nombre;
        producto.precio = precio;
        producto.cantidad = cantidad;
        producto.categoria = categoria;
        producto.descripcion = descripcion;
        
        await producto.save();
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
}

// Endpoint "Baja Logica de Producto"
const bajaLogicaProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        producto.estado = "inactivo";
        producto.cantidad = 0;
        await producto.save();
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar la baja lógica del producto.' });
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    bajaLogicaProducto
}
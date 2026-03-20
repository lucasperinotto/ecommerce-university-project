const carritos = require('../data/carritos.data.json');

// Endpoint "Obtener un Carrito por ID de Usuario"
const obtenerCarritoPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const carrito = carritos.find(c => c.id == id);

    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado.'});
    }

    res.json(carrito);
};

function guardarCarritos(carritos) {
    try {
        const fs = require('fs');
        fs.writeFileSync(carritos_json, JSON.stringify(carritos, null, 2))
    } catch (error) {
        console.error('Error al guardar carritos: ', error)
    }
}

// Endpoint "Crear Carrito"
const crearCarrito = (req, res) => {
    const nuevoCarrito = {
        id: carrito.length + 1,
        productos: []
    }

    carritos.push(nuevoCarrito);
    guardarCarritos(carritos);
    res.status(201).json(nuevoCarrito);
}

// Endpoint "Agregar Producto a un Carrito"
const agregarProductoAlCarrito = (req, res) => {
    
};

module.exports = {
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
}
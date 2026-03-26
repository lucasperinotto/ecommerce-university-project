const express = require('express');
const router = express.Router();

const {
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
} = require('../controllers/carrito.controller');

router.get('/:id', obtenerCarritoPorId);
router.post('/:id', crearCarrito);
router.post('/:id/items', agregarProductoAlCarrito);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
    obtenerCarritos,
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito,
    modificarCantidadProducto,
    eliminarProductoDelCarrito,
    vaciarCarrito
} = require('../controllers/carrito.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, adminMiddleware, obtenerCarritos);
router.get('/:id', authMiddleware, obtenerCarritoPorId);
router.post('/:id', authMiddleware, crearCarrito);
router.post('/:id/items', authMiddleware, agregarProductoAlCarrito);
router.put('/:id/items/:idProducto', authMiddleware, modificarCantidadProducto);
router.delete('/:id/items/:idProducto', authMiddleware, eliminarProductoDelCarrito);
router.delete('/:id/items', authMiddleware, vaciarCarrito);

module.exports = router;
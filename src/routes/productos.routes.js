const express = require('express');
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    bajaLogicaProducto,
    restaurarProducto,
    ajustarStock
} = require('../controllers/productos.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', authMiddleware, adminMiddleware, crearProducto);
router.put('/:id', authMiddleware, adminMiddleware, actualizarProducto);
router.delete('/:id', authMiddleware, adminMiddleware, bajaLogicaProducto);
router.patch('/:id/restore', authMiddleware, adminMiddleware, restaurarProducto);
router.patch('/:id/stock', ajustarStock);

module.exports = router;

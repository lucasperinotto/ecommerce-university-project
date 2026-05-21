const express = require('express');
const router = express.Router();

const {
    obtenerCarritos,
    obtenerCarritoPorId,
    crearCarrito,
    agregarProductoAlCarrito
} = require('../controllers/carrito.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, adminMiddleware, obtenerCarritos);
router.get('/:id', authMiddleware, adminMiddleware, obtenerCarritoPorId);
router.post('/:id', crearCarrito);
router.post('/:id/items', agregarProductoAlCarrito);

module.exports = router;
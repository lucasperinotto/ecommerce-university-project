const express = require('express');
const router = express.Router();

const {
    obtenerOrdenes,
    obtenerOrdenesPorUsuario,
    generarOrden
} = require('../controllers/ordenes.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, adminMiddleware, obtenerOrdenes);
router.get('/:id', authMiddleware, adminMiddleware, obtenerOrdenesPorUsuario);
router.post('/:id', authMiddleware, generarOrden);

module.exports = router;


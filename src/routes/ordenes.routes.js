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
router.get('/usuario/:id', authMiddleware, obtenerOrdenesPorUsuario);
router.post('/', authMiddleware, generarOrden);

module.exports = router;


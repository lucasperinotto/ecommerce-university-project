const express = require('express');
const router = express.Router();

const {
    obtenerOrdenes,
    obtenerOrdenesPorUsuario,
    generarOrden
} = require('../controllers/ordenes.controller');

router.get('/', obtenerOrdenes);
router.get('/:id', obtenerOrdenesPorUsuario);
router.post('/:id', generarOrden);

module.exports = router;


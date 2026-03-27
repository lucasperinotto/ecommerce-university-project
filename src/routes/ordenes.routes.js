const express = require('express');
const router = express.Router();

const {
    obtenerOrdenes,
    obtenerOrdenPorUsuario,
    generarOrden
} = require('../controllers/ordenes.controller');

router.get('/', obtenerOrdenes);
router.get('/:id', obtenerOrdenPorUsuario);
router.post('/', generarOrden);

module.exports = router;


const express = require('express');
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    bajaLogicaUsuario
} = require('../controllers/usuarios.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, adminMiddleware, obtenerUsuarios);
router.get('/:id', authMiddleware, obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.put('/:id', authMiddleware, actualizarUsuario);
router.delete('/:id', authMiddleware, adminMiddleware, bajaLogicaUsuario);

module.exports = router;
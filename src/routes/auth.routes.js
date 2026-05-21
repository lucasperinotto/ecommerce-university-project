const express = require('express');
const router = express.Router();

const { 
    login 
} = require('../controllers/auth.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.post('/login', authMiddleware, login);

modules.exports = router;
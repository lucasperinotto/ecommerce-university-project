const express = require('express');
const router = express.Router();

const { 
    login,
    forgotPassword
} = require('../controllers/auth.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;
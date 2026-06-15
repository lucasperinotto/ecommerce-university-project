const express = require('express');
const router = express.Router();

const { 
    login,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

const {
    authMiddleware,
    adminMiddleware
} = require('../middlewares/auth.middleware')

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
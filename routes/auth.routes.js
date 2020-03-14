// Rutas para autenticar usuarios
const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const auth = require('../middleware/auth');

const { check } = require('express-validator');

// verifica si un usuario es valido o no
// endpoint /api/auth
router.post('/',
    authController.autenticarUsuario
);

// obtiene elusuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)


module.exports = router;
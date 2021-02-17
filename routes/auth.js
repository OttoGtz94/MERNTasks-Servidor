// rutas para autenticar los usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// autenticar usuario
router.post(
	'/',
	// reglas de validacion con express-validator
	[
		check('email', 'Agrega un email válido').isEmail(),
		check(
			'password',
			'El password debe tener minimo 6 caracteres',
		).isLength({ min: 6 }),
	],
	authController.autenticarUsuario,
);

module.exports = router;

const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// crear tarea
router.post(
	'/',
	auth,
	[
		check('nombre', 'El nombre de tarea es obligatorio')
			.not()
			.isEmpty(),
	],
	tareaController.crearTarea,
);

module.exports = router;

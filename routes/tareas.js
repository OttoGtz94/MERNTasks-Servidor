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
// obtener tareas por proyecto
router.get('/', auth, tareaController.obtenerTareas);
// actualizar tareas
router.put('/:id', auth, tareaController.actualizarTarea);
// eliminar tarea
router.delete('/:id', auth, tareaController.eliminarTarea);

module.exports = router;

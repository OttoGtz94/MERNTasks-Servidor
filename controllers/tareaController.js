const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// crear nueva tarea
exports.crearTarea = async (req, res) => {
	// revisar si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	try {
		// extraer el proyecto
		const { proyecto } = req.body;
		// comprobar si existe
		const existeProyecto = await Proyecto.findById(proyecto);
		if (!existeProyecto) {
			return res
				.status(404)
				.json({ msg: 'Proyecto no encontrado' });
		}

		// revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		// crear la tarea
		const tarea = new Tarea(req.body);
		await tarea.save();
		res.json({ tarea });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al crear tarea');
	}
};
// obtener tareas
exports.obtenerTareas = async (req, res) => {
	try {
		// extraer el proyecto
		const { proyecto } = req.body;
		// comprobar si existe
		const existeProyecto = await Proyecto.findById(proyecto);
		if (!existeProyecto) {
			return res
				.status(404)
				.json({ msg: 'Proyecto no encontrado' });
		}

		// revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		// obtener tareas por proyecto
		const tareas = await Tarea.find({ proyecto });
		res.json({ tareas });
	} catch (error) {
		console.log(error);
		res.status(404).send('Error al obtener tareas');
	}
};

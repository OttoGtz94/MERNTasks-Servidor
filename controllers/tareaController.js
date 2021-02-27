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
		const { proyecto } = req.query;
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
		res.status(500).send('Error al obtener tareas');
	}
};
exports.actualizarTarea = async (req, res) => {
	try {
		// extraer el proyecto
		const { proyecto, nombre, estado } = req.body;

		// comprobar si la tarea existe
		let tarea = await Tarea.findById(req.params.id);

		if (!tarea) {
			return res.status(404).json({ msg: 'No existe tarea' });
		}

		// comprobar si existe
		const existeProyecto = await Proyecto.findById(proyecto);

		// revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		// crear obj con nva info
		const nuevaTarea = {};
		nuevaTarea.nombre = nombre;
		nuevaTarea.estado = estado;
		// if (nombre) {
		// 	nuevaTarea.nombre = nombre;
		// }
		// if (estado) {
		// 	nuevaTarea.estado = estado;
		// }

		// guardar tarea
		tarea = await Tarea.findOneAndUpdate(
			{ _id: req.params.id },
			nuevaTarea,
			{ new: true },
		);
		res.json({ tarea });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al obtener tareas');
	}
};

exports.eliminarTarea = async (req, res) => {
	try {
		// extraer el proyecto
		const { proyecto } = req.query;

		// comprobar si la tarea existe
		let tarea = await Tarea.findById(req.params.id);

		if (!tarea) {
			return res.status(404).json({ msg: 'No existe tarea' });
		}

		// comprobar si existe
		const existeProyecto = await Proyecto.findById(proyecto);

		// revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		// eliminar tarea
		await Tarea.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: 'Tarea eliminada' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al obtener tareas');
	}
};

const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// crear proyectos
exports.crearProyecto = async (req, res) => {
	// revisar si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	try {
		// crear un nuevo proyecto
		const proyecto = new Proyecto(req.body);

		// guardar el creador con jwt
		proyecto.creador = req.usuario.id;

		// guardamos el proyecto
		proyecto.save();
		res.json(proyecto);
	} catch (error) {
		console.log(error);
		res.status(500).send('Hubo un error');
	}
};

// obtener los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
	try {
		const proyectos = await Proyecto.find({
			creador: req.usuario.id,
		});
		res.json({ proyectos });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al importar los proyectos');
	}
};

// actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
	// revisar si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	// extraer inf del proycto
	const { nombre } = req.body;
	const nuevoProyecto = {};
	if (nombre) {
		nuevoProyecto.nombre = nombre;
	}

	try {
		// revisar el id
		let proyecto = await Proyecto.findById(req.params.id);

		// verificar si el proyecto existe
		if (!proyecto) {
			return res
				.status(404)
				.json({ msg: 'Se no sencontro el proyecto' });
		}
		// verificar el creador del proyecto
		if (proyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}
		// actualizar
		proyecto = await Proyecto.findByIdAndUpdate(
			{ _id: req.params.id }, //Hace la funcion del where de sql
			{ $set: nuevoProyecto },
			{ new: true },
		);
		res.json({ proyecto });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al actualizar proyecto');
	}
};

// eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
	try {
		// revisar el id
		let proyecto = await Proyecto.findById(req.params.id);

		// verificar si el proyecto existe
		if (!proyecto) {
			return res
				.status(404)
				.json({ msg: 'Se no sencontro el proyecto' });
		}
		// verificar el creador del proyecto
		if (proyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		// eliminar uel proyecto
		await Proyecto.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: 'Proyecto eliminado' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error al eliminar proyecto');
	}
};

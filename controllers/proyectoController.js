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

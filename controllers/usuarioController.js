const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
	// revisar si hay errores en express-validator
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	// extraer email y password
	const { email, password } = req.body;

	try {
		// revisar que el email sea unico
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res
				.status(400)
				.json({ msg: 'EL correo ya existe' });
		}

		// crear usuario
		usuario = new Usuario(req.body);

		// encriptar password
		const salt = await bcryptjs.genSalt(10);
		usuario.password = await bcryptjs.hash(password, salt);

		// guardar usuario
		await usuario.save();

		// mensaje de confirmacion
		res.json({ msg: 'Usuario creado correctamente' });
	} catch (error) {
		console.log(error);
		res.status(400).send('Hubo un error');
	}
};

const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
	// revisar si hay errores en express-validator
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	// extraer email y password
	const { email, password } = req.body;

	try {
		// revisar que sea un usuario registrado
		let usuario = await Usuario.findOne({ email }); //Busca un usuario por email
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: 'El usuario no existe' });
		}
		// revisar password
		const passCorrecto = await bcryptjs.compare(
			password,
			usuario.password,
		);
		if (!passCorrecto) {
			return res
				.status(400)
				.json({ msg: 'Password incorrecto' });
		}
		// Cuando pasa la autenticación
		// crear el json web token
		const payload = {
			usuario: {
				id: usuario.id, //guardamos como payload el id del usuario
			},
		};
		// firmar e json web token
		jwt.sign(
			payload,
			process.env.SECRETA,
			{
				expiresIn: 3600, //para que expire en una hora
			},
			(error, token) => {
				if (error) throw error;
				// mensaje de confirmacion
				res.json({ token: token });
			},
		);
	} catch (error) {
		console.log(error);
	}
};

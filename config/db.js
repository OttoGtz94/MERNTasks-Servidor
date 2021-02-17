const mongoose = require('mongoose');
// Importamos variables de entorno con dotenv
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
	try {
		await mongoose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log('Base de datos conectada');
	} catch (error) {
		console.log('Tienes un error' + error);
		process.exit(1);
	}
};

module.exports = conectarDB;

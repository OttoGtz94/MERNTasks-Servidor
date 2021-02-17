const express = require('express');
const conectarDB = require('./config/db');

// Crear servidor
const app = express();
// Puerto de la app
const PORT = process.env.PORT || 4000;
// Conectar a la BD
conectarDB();

// Arrancar la app
app.listen(PORT, () => {
	console.log(`Servidor en el puerto: ${PORT}`);
});

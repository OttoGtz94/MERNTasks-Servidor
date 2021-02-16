const express = require('express');

// Crear servidor
const app = express();
// Puerto de la app
const PORT = process.env.PORT || 4000;

// Arrancar la app
app.listen(PORT, () => {
	console.log(`Servidor en el puerto: ${PORT}`);
});

const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Crear servidor
const app = express();
// Puerto de la app
const PORT = process.env.PORT || 5000;
// Conectar a la BD
conectarDB();

// habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Arrancar la app
app.listen(PORT, () => {
	console.log(`Servidor en el puerto: ${PORT}`);
});

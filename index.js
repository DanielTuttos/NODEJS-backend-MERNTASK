const express = require('express');

const conectarDB = require('./config/db');

// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();

// Hbilitar express.json
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// puerto de la app
const PORT = process.env.PORT || 4000;

// importar rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/proyectos', require('./routes/proyectos.routes'));
app.use('/api/tareas', require('./routes/tareas.routes'));

// arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})
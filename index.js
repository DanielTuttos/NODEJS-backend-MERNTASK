const express = require('express');

const conectarDB = require('./config/db');

const cors = require('cors');
const morgan = require('morgan');

// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();
app.use(morgan('dev'));

// Hbilitar express.json
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));


// habilitar cors
app.use(cors());

// puerto de la app
const port = process.env.port || 4000;

// importar rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/proyectos', require('./routes/proyectos.routes'));
app.use('/api/tareas', require('./routes/tareas.routes'));

// arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})
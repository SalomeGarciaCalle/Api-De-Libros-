const express = require('express');
const cors = require('cors');

const app = express();

// HABILITA CORS PARA PERMITIR PETICIONES DESDE CUALQUIER FRONTEND
app.use(cors());

app.use(express.json());

// Rutas
const librosRoutes = require('./routes/libros.routes');
app.use('/libros', librosRoutes);

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});

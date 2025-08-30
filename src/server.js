const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('API del Meal Planner está activa.');
});

// --- Rutas de la API ---
const hogarRoutes = require('./api/hogarRoutes.js');
const ingredienteRoutes = require('./api/ingredienteRoutes.js');
const miembroRoutes = require('./api/miembroRoutes.js');
const platoRoutes = require('./api/platoRoutes.js');

app.use('/api/hogares', hogarRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/miembros', miembroRoutes);
app.use('/api/platos', platoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;

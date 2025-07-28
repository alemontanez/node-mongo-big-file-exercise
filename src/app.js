#!/usr/bin/env node
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const recordRoutes = require('./routes/records.routes');
const connectToDatabase = require('./config/database');
const { PORT } = require('./config/env');

morgan.token('host', (req) => req.headers.host);
morgan.token('worker', () => process.pid);

const app = express();

/* REST CONFIG */
app.set('view engine', 'ejs');
app.set('trust proxy', true);

// Se cambió esto para evitar recibir JSON de tamaños grandes y evitar problemas de rendimiento.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Comprime las respuestas para mejorar rendimiento
app.use(compression());
app.use(morgan('[:worker] :remote-addr (:user-agent) :host - :method :url HTTP/:http-version :status - :res[content-length] bytes - :response-time[0] ms'));
/* REST CONFIG */

/* ROUTES */
app.use('/', recordRoutes);
/* ROUTES */

// Inicializa conexión a la base de datos y levanta el servidor
(async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.info(`ReachOut Exercise listening on port ${PORT} and environment ${process.env.NODE_ENV}! - Worker ${process.pid}`));
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
})();

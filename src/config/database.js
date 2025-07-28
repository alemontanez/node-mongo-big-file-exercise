const mongoose = require('mongoose');
const { MONGODB_URL } = require('./env');

// Desactiva advertencias por filtros no declarados (recomendación de Mongoose)
mongoose.set('strictQuery', false);

// Función que establece la conexión con MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Finaliza el proceso si la conexión falla
  }
};

module.exports = connectToDatabase;

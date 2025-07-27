const mongoose = require('mongoose');
const { MONGODB_URL } = require('./env');

mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;

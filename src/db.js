const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://SabinaAccesorios:Sabina2026@sabinaaccesorios.nnvcclq.mongodb.net/?appName=SabinaAccesorios';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error de conexión. ", error);
    throw error;
  }
};

module.exports = connectDB;
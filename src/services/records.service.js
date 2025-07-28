const fs = require('fs');
const csv = require('csv-parser');
const Records = require('../models/records.model');

// Procesa un archivo CSV, eliminando duplicados y guardando los registros en la base de datos
const processCsvFile = async (filePath) => new Promise((resolve, reject) => {
  const uniqueMap = new Map(); // Map para almacenar registros únicos por ID
  let readCount = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      readCount += 1;
      const id = data.id?.trim();
      if (id && !uniqueMap.has(id)) {
        uniqueMap.set(id, data); // Solo se agregan registros con ID no repetido
      }
    })
    .on('end', async () => {
      try {
        const uniqueRecords = Array.from(uniqueMap.values());
        const inserted = await Records.insertMany(uniqueRecords); // Inserción masiva en MongoDB
        fs.unlink(filePath, () => { }); // // Elimina el archivo temporal luego de procesarlo
        resolve({ readCount, insertedCount: inserted.length });
      } catch (err) {
        reject(err); // Captura errores durante la inserción a la base de datos
      }
    })
    .on('error', (err) => {
      reject(err); // Captura errores durante la lectura del archivo
    });
});

module.exports = {
  processCsvFile,
};

const fs = require('fs');
const csv = require('csv-parser');
const Records = require('../models/records.model');

const processCsvFile = async (filePath) => new Promise((resolve, reject) => {
  const uniqueMap = new Map();
  let readCount = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      readCount += 1;
      const id = data.id?.trim();
      if (id && !uniqueMap.has(id)) {
        uniqueMap.set(id, data);
      }
    })
    .on('end', async () => {
      try {
        const uniqueRecords = Array.from(uniqueMap.values());
        const inserted = await Records.insertMany(uniqueRecords);
        fs.unlink(filePath, () => { }); // eliminar archivo temporal
        resolve({ readCount, insertedCount: inserted.length });
      } catch (err) {
        reject(err);
      }
    })
    .on('error', (err) => {
      reject(err);
    });
});

module.exports = {
  processCsvFile,
};

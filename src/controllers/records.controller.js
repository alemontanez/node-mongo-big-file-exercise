const Records = require('../models/records.model');
const { processCsvFile } = require('../services/records.service');

const upload = async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: 'No se proporcionó ningún archivo.' });
  }
  try {
    const { readCount, insertedCount } = await processCsvFile(file.path);
    return res.status(200).json({
      message: 'El archivo se procesó correctamente.',
      readCount,
      insertedCount,
      repeatedCount: readCount - insertedCount,
    });
  } catch (error) {
    console.error('Error en el controlador upload:', error);
    return res.status(500).json({ message: 'Ha ocurrido un error en el servidor al procesar el archivo.' });
  }
};

const list = async (_, res) => {
  try {
    const data = await Records
      .find({})
      .limit(10)
      .lean();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  upload,
  list,
};

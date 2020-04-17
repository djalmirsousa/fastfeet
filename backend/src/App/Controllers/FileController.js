import File from '../Models/File';
import Exception from '../Exceptions/ServiceException';

export default {
  async store(req, res, next) {
    if (!req.file || !req.file.originalname || !req.file.filename) {
      throw new Exception('Invalid File.');
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    req.fileId = file.id;

    return next();
  },
};

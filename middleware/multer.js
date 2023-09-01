import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
// Export the multer middleware with configured storage
export const multerMiddleware = multer({ storage: storage });

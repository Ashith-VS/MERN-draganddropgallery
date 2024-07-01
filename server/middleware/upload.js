const multer = require("multer");

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);// Generate unique filenames
    },
  });

  const upload = multer({ storage: storage });
  
  module.exports = upload;

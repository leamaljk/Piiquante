//add multer for file handling request.
const multer = require('multer');

//set extension for file name
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//call diskstorage for mutler modle
const storage = multer.diskStorage({
  //set destination
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //set filename
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
const multer = require('multer')

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './data/csv/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})
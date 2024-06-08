const multer = require('multer')

module.exports.videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../data/csv/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})

module.exports.pictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../data/picture/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})
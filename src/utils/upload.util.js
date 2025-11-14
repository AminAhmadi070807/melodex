"use strict"

const multer = require('multer')
const path = require('path')

module.exports = (fileAddress) => {
    return multer.diskStorage({
        destination: (req, file, callback) => callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', fileAddress)),
        filename: (req, file, callback) => {
            const filename = `${Date.now()}-${file.originalname}`

            return callback(null, filename)
        }
    })
}
"use strict"

const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

module.exports = (fileAddress) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', fileAddress))
        },
        filename: (req, file, callback) => {
            const filename = `${Date.now()}-${crypto.createHash('sha256').update(file.originalname).digest('base64url')}${path.extname(file.originalname)}`

            return callback(null, filename)
        }
    })
}
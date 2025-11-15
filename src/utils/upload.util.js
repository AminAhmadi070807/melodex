"use strict"

const multer = require('multer')
const path = require('path')

module.exports = (fileAddress) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            if (fileAddress !== "change") return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', fileAddress))
            else if (fileAddress === 'change') {
                switch (file.fieldname) {
                    case 'musics':
                        return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', 'musics'));
                    case 'posters':
                        return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', 'posters'));
                    case 'covers':
                        return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', 'covers'));
                    case 'videos':
                        return callback(null, path.resolve(__dirname, '..', '..', 'public', 'uploads', 'videos'));
                    default:
                        return callback(new Error("Unexpected field"));
                }
            }
            else return callback(new Error("Unexpected field"));
        },
        filename: (req, file, callback) => {
            const filename = `${Date.now()}-${file.originalname}`

            return callback(null, filename)
        }
    })
}
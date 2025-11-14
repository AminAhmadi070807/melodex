"use strict"

const fs = require('fs')

module.exports = async (baseFile ,filename) => {
    try {
        if (!baseFile || !filename) return { status: 422, message: "baseFile and fileName is required" }

        const isAvailableFile = fs.existsSync(`${baseFile}/${filename}`)

        if (isAvailableFile) {
            fs.unlinkSync(`${baseFile}/${filename}`)
            return { status: 200, message: "deleted file successfully" }
        }
        else return { status: 404, message: "File not available. or already deleted." }
    }
    catch(error) {
        return { status: 500, message: error.message || "There was a problem deleting the file." }
    }
}
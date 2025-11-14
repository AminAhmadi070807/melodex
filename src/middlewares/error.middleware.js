"use strict"

const Joi = require('joi')
const response = require('../helpers/response.helper')
const fileDeleter = require('../utils/delete.file.util')

module.exports = async (err, req, res, next) => {
    try {
        if (Joi.isError(err)) {
            const error = err.details[0].message

            return response(res, 422, error.replace(/['"]/g, ""))
        }

        if (req.files) {
            const files = req.files

            for (const file of files) await fileDeleter('public/uploads/profiles', file.filename)
        }
        else if (req.file) {
            const file = req.file
            await fileDeleter('public/uploads/profiles', file.filename)
        }

        return response(res, 500, `${err.name} : ${err.message}`)
    }
    catch (error) {
        return res.status(error.status || 500).json({ status: error.status || 500, message: error.message || "OoOps Unknown Server error" })
    }
}
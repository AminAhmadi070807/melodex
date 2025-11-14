"use strict"

const response = require('../../helpers/response.helper')
const {isValidObjectId} = require("mongoose");

module.exports = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!isValidObjectId(id)) return response(res, 422, "Id is not correct")

        next()
    }
    catch (error) {
        next(error)
    }
}
"use strict"

module.exports = (res, status , message, data) => {
    try {
        return res.status(status).json({ status, message, data })
    }
    catch (error) {
        throw error;
    }
}
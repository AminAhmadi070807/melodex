"use strict"

const response = require('../../helpers/response.helper')

module.exports = (roles) => {
    return (req, res, next) => {
        try {
            if (!Array.isArray(roles)) roles = [roles]

            const user = req.user;

            for (const role of user.role) if (role === "ADMIN" || roles.includes(role)) return next()

            return response(res, 403, "This api is protected. You do not have access to this api")
        }
        catch (error) {
            next(error)
        }
    }
}
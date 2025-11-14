"use strict"

const userModel = require("../users/user.model");
const response = require("../../../helpers/response.helper");
const pagination = require("../../../utils/pagination.util");

const ROLE_LEVELS = {
    1: ["USER"],
    2: ["USER"],
    3: ["USER", "EDITOR"],
    4: ["USER", "EDITOR", "CONTENT-MODERATOR"],
    5: ["USER", "EDITOR", "CONTENT-MODERATOR", "ADOPS"],
    6: ["USER", "EDITOR", "CONTENT-MODERATOR", "ADOPS", "INVESTOR"],
    7: ["USER", "EDITOR", "CONTENT-MODERATOR", "ADOPS", "INVESTOR", "BOT"],
    8: ["USER", "EDITOR", "CONTENT-MODERATOR", "ADOPS", "INVESTOR", "BOT", "ADMIN"]
};

module.exports.All = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await userModel.find({}).limit(+page * +limit).lean()
        const counts = await userModel.countDocuments({})

        return response(res, 200, null, { users, pagination: pagination(+page, +limit, counts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.updateRole = async (req, res, next) => {
    try {
        const { phone, level } = req.body

        const user = await userModel.findOneAndUpdate({ phone }, {
            role: ROLE_LEVELS[+level]
        })

        if (!user) return response(res, 404, "User with phone number not found.")

        return response(res, 200, "Update user role successfully.")
    }
    catch (error) {
        next(error)
    }
}
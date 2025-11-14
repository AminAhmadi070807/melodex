"use strict"

const banModel = require('./ban.model')
const userModel = require('../users/user.model')
const refreshTokenModel = require('../token/refresh.token.model')
const response = require('../../../helpers/response.helper')
const pagination = require('../../../utils/pagination.util')
const {isValidObjectId} = require("mongoose");

module.exports.banAndUpdate = async (req, res, next) => {
    try {
        const { phone, expire } = req.body

        const user = await userModel.findOne({ phone }).lean()

        if (user.roles.includes("USER") || user.roles.includes("ARTIST") || user.roles.includes("USER")) {}

        await refreshTokenModel.deleteOne({ user: user._id })

        const updateUserBan = await banModel.findOneAndUpdate({ phone }, {
            phone,
            expire,
            expireAt: expire === "Timeout" ? new Date(new Date().setMonth(new Date().getMonth() + 3)) : new Date(new Date().setFullYear(new Date().getFullYear() + 30))
        })

        if (updateUserBan) return response(res, 200, "Update user ban successfully.")

        await banModel.create({
            phone,
            expire,
            expireAt: expire === "Timeout" ? new Date(new Date().setMonth(new Date().getMonth() + 3)) : new Date(new Date().setFullYear(new Date().getFullYear() + 30))
        })

        return response(res, 201, "User banned successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!isValidObjectId(id)) return response(res, 422, "Id is not correct.")

        const isExistPhoneBaned = await banModel.findByIdAndDelete(id)

        if (isExistPhoneBaned) return response(res, 200, "Deleted user ban from bans successfully.")

        return response(res, 404, "User not found.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 25, expire = "Timeout" } = req.query

        const users = await banModel.find({ expire }).limit(+page * +limit).lean()

        const userCounts = await banModel.countDocuments({ expire })

        return response(res, 200, null, { users, pagination: pagination(+page, +limit, userCounts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!isValidObjectId(id)) return response(res, 422, "Id is not correct.")

        const user = await banModel.findById(id).lean()

        if (!user) return response(res, 404, "user with id not found in bans")

        return response(res, 200, null, user)
    }
    catch (error) {
        next(error)
    }
}
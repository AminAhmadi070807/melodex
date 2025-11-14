"use strict"

const followModel = require('./follow.model')
const userModel = require('../users/user.model')
const response = require('../../../helpers/response.helper')

module.exports.follow = async (req, res, next) => {
    try {
        const user = req.user
        const { id : following } = req.params

        const userFollower = await userModel.findById(following).lean()

        if (!userFollower) return response(res, 404, "user not found")

        const isExistFollow = await followModel.findOne({ following, follower: user._id }).lean()

        if (isExistFollow) return response(res, 409, "You had already followed.")

        await followModel.create({
            following,
            follower: user._id
        })

        return response(res, 201, "You have successfully followed.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.unFollow = async (req, res, next) => {
    try {
        const user = req.user
        const { id : following } = req.params

        const isExistFollow = await followModel.findOne({ following, follower: user._id }).lean()

        if (!isExistFollow) return response(res, 404, "You dont followed")

        await followModel.deleteOne({
            following,
            follower: user._id
        })

        return response(res, 200, "You have successfully unFollowed.")
    }
    catch (error) {
        next(error)
    }
}
"use strict"

const userModel = require('./user.model')
const planModel = require('../plans/plan.model')
const refreshTokenModel = require('../token/refresh.token.model')
const followModel = require('../follow/follow.model')
const bcrypt = require('bcrypt');
const fileDeleter = require('../../../utils/delete.file.util')

const imageFormats = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    'image/svg+xml',
    "image/webp",
    'image/svg'
]

const response = require('../../../helpers/response.helper')

module.exports.update = async (req, res, next) => {
    try {
        const user = req.user;
        req.body.password = await bcrypt.hash(req.body.password, 10);

        const isExistUsername = await userModel.findOne({ username: req.body.username })

        if (isExistUsername && (user._id.toString() !== isExistUsername._id.toString())) {
            await fileDeleter('public/uploads/profiles', req.file.filename)
            return response(res, 409, 'username already exists')
        }

        if (req.file) {
            if (!imageFormats.includes(req.file.mimetype)) {
                await fileDeleter('public/uploads/profiles', req.file.filename)
                return response(res, 400, "File format is not valid.")
            }

            await userModel.findByIdAndUpdate(user._id, {
                $push: { profile: [ '/uploads/profiles/' + req.file.filename] }
            }, { new: true })
        }

        const update =  await userModel.findByIdAndUpdate(user._id, {
            ...req.body,
        }, { new: true })

        return response(res, 200, "update user information successfully", update)
    }
    catch (error) {
        await fileDeleter('public/uploads/profiles', req.file.filename)
        next(error)
    }
}

module.exports.updateSettings = async (req, res, next) => {
    try {
        const user = req.user;

        const update =  await userModel.findByIdAndUpdate(user._id, {
            settings: {
                ...req.body
            }
        }, { new: true })

        if (!update) return response(res, 404, "User not found.")

        return response(res, 200, "Update settings successfully.", update)
    }
    catch (error) {
        next(error)
    }
}

module.exports.getSettings = async (req, res, next) => {
    try {
        const user = req.user.settings;

        return response(res, 200, null, user)
    }
    catch (error) {
        next(error)
    }
}

// TODO
module.exports.getMe = async (req, res, next) => {
    try {
        const user = req.user
        const userPlan = await planModel.findOne({ user: user._id }).sort({ createdAt: -1 }).lean()

        const followers = await followModel.find({ follower: user._id }).lean()
        const followings = await followModel.find({ following: user._id }).lean()

        return response(res, 200, null, { user, plan: userPlan, followings, followers })
    }
    catch (error) {
        next(error)
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        const user = req.user

        const { 'refresh-token': refreshToken, 'access-token': accessToken } = req.cookies

        refreshToken && res.clearCookie('refresh-token')
        accessToken && res.clearCookie('access-token')

        await refreshTokenModel.findOneAndDelete({ user: user._id }).lean()

        return response(res, 200, "Logged out successfully")
    }
    catch (error) {
        next(error)
    }
}

// TODO
module.exports.getOne = async (req, res, next) => {
    try {
        const user = req.user
        const { id } = req.params;

        const userResult = await userModel.findById(id).select("-role -plan -settings -phone -password").lean()

        if (!userResult) return response(res, 404, "User not found")

        const isFollowing = await followModel.findOne({ follower: user._id, following: userResult._id }).lean()

        if (!isFollowing && user._id.toString() !== userResult._id.toString()) return response(res, 200, null, { userResult })

        const followers = await followModel.find({ follower: user._id }).select("-follower").populate("following", 'fullName username profile').lean()
        const followings = await followModel.find({ following: user._id }).select("-following").populate("follower", 'fullName username profile').lean()

        return response(res, 200, null, { userResult, followers, followings })
    }
    catch (error) {
        next(error)
    }
}

module.exports.removeProfile = async (req, res, next) => {
    try {
        const user = req.user
        const { route } = req.body;

        const isExistUserRoute = user.profile.includes(route)

        if (!isExistUserRoute) return response(res, 404, "profile not found. or has already been deleted.")

        await fileDeleter('public', route)

        await userModel.findByIdAndUpdate(user._id, {
            $pull: {
                profile: route
            }
        })

        return response(res, 200, "Profile removed successfully.")
    }
    catch (error) {
        next(error)
    }
}
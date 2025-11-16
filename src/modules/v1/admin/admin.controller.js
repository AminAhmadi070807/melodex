"use strict"

const userModel = require("../users/user.model");
const postModel = require('../posts/post.model')
const storyModel = require('../stories/stories.model')
const commentModel = require('../comments/comment.model')
const response = require("../../../helpers/response.helper");
const pagination = require("../../../utils/pagination.util");
const timeFormat = require("../../../utils/time.util");

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

const timeFormatSetter = async (data) => {
    const resultArray = []

    for (const info of data) {
        const timeAgo = await timeFormat(info.createdAt, info.createdAt);

        resultArray.push({
            ...info,
            ...timeAgo
        });
    }

    return resultArray;
}

module.exports.AllAdmins = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await userModel.find({ role: { $elemMatch: { $ne: 'USER' } } }, 'profile username fullName role').sort({ _id: -1 }).limit(+page * +limit).lean()
        const counts = await userModel.countDocuments({})

        return response(res, 200, null, { users, pagination: pagination(+page, +limit, counts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.AllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await userModel.find({}, 'profile username fullName bio').sort({ _id: -1 }).limit(+page * +limit).lean()
        const counts = await userModel.countDocuments({})

        return response(res, 200, null, { users, pagination: pagination(+page, +limit, counts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.AllPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        let posts = await postModel.find({}).limit(+page * +limit).populate("user", 'fullName profile username').sort({ _id: -1 }).lean()
        const counts = await postModel.countDocuments({})

        posts = await timeFormatSetter(posts)

        return response(res, 200, null, { posts, pagination: pagination(+page, +limit, counts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.AllStories = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        let stories = await storyModel.find({}).limit(+page * +limit).populate("user", 'fullName profile username').sort({ _id: -1 }).lean()
        const counts = await storyModel.countDocuments({})

        stories = await timeFormatSetter(stories)

        return response(res, 200, null, { stories, pagination: pagination(+page, +limit, counts) })
    }
    catch (error) {
        next(error)
    }
}

module.exports.AllComments = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        let comments = await commentModel.find({}).limit(+page * +limit).populate("user", 'fullName profile username').sort({ _id: -1 }).lean()
        const counts = await commentModel.countDocuments({})

        comments = await timeFormatSetter(comments)

        return response(res, 200, null, { comments, pagination: pagination(+page, +limit, counts) })
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
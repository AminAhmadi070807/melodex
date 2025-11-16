"use strict"

const storiesModel = require('./stories.model')
const followModel = require("../follow/follow.model");
const fileDeleter = require('../../../utils/delete.file.util')
const response = require('../../../helpers/response.helper')
const formatTimeAgo = require("../../../utils/time.util");

module.exports.upload = async (req, res, next) => {
    try {
        const user = req.user;
        const files = req.files

        for (const file of files) await storiesModel.create({
                user: user._id,
                route: `/uploads/stories/${file.filename}`,
            })

        return response(res, 201, 'upload stories successfully')
    }
    catch(err) {
        next(err)
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params

        const story = await storiesModel.findById(id).populate('user').populate("viewer", 'fullName username profile').lean()

        if (!story) return response(res, 404, 'store not found. or has already been removed.')

        if (story.user.settings?.Private === "PRIVATE" && story.user._id.toString() !== user._id.toString()) {
            const isFollowed = await followModel.findOne({ follower: post.user._id, following: user._id }).lean()

            if (!isFollowed) return response(res, 403, "This page is private. you don't follow this user.")
        }

        const timeAgo = formatTimeAgo(story.createdAt, story.updatedAt)

        if (timeAgo.updatedAt === "24 hours ago") {
            const removeStorey = await storiesModel.findByIdAndDelete(id).lean()
            if (removeStorey) await fileDeleter('public', removeStorey.route)
            return response(res, 404, null, [])
        }

        await storiesModel.findByIdAndUpdate(id, {
            $addToSet: {
                viewer: user._id
            }
        })

        if (story.user._id.toString() !== user._id.toString()) {
            return response(res, 200, null, {
                storey: {
                    ...story, ...timeAgo,
                    views: undefined,
                    user: {
                        profile: user.profile,
                        username: user.username,
                        fullName: user.fullName
                    }
                }
            })
        }

        return response(res, 200, null, {
            storey: { ...story, ...timeAgo,
                user: {
                profile: user.profile,
                    username: user.username,
                    fullName: user.fullName
                }
            }
        }
        )
    }
    catch (error) {
        next(error)
    }
}

module.exports.userStories = async (req, res, next) => {
    try {
        const { id } = req.params

        const stories = await storiesModel.find({ user: id }, '_id').lean()

        return response(res, 200, null, stories)
    }
    catch (error) {
        next(error)
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params

        const story = await storiesModel.findOneAndDelete({ user: user._id, _id: id }).lean()

        if (!story) return response(res, 404, 'store not found. or has already been removed.')

        await fileDeleter('public', story.route)

        return response(res, 200, 'Deleted store successfully.')
    }
    catch (error) {
        next(error)
    }
}

module.exports.feedStories = async (req, res, next) => {
    try {
        const user = req.user;

        const userFollower = await followModel.find({ following: user._id }, 'follower').populate("follower", 'username fullName profile').sort({ _id: -1 }).lean()

        const userStoriesArray = []
        for (const user of userFollower) {
            const stories = await storiesModel.find({ user: user.follower._id }).populate("user", 'fullName username profile').sort({ createdAt: -1 }).lean()

            userStoriesArray.push({
                ...user.follower,
                stories
            })
        }

        return response(res, 200, null, {userStoriesArray})
    }
    catch (error) {
        next(error)
    }
}
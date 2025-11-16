"use strict"

const storiesModel = require('./stories.model')

const fileDeleter = require('../../../utils/delete.file.util')
const response = require('../../../helpers/response.helper')
const followModel = require("../follow/follow.model");
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

        const storey = await storiesModel.findById(id).populate('user').populate("viewer", 'fullName username profile').lean()

        if (!storey) return response(res, 404, 'store not found. or has already been removed.')

        if (storey.user.settings?.Private === "PRIVATE" && storey.user._id.toString() !== user._id.toString()) {
            const isFollowed = await followModel.findOne({ follower: post.user._id, following: user._id }).lean()

            if (!isFollowed) return response(res, 403, "This page is private. you don't follow this user.")
        }

        const timeAgo = formatTimeAgo(storey.createdAt, storey.updatedAt)

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

        if (storey.user._id.toString() !== user._id.toString()) {
            return response(res, 200, null, {
                storey: {
                    ...storey, ...timeAgo,
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
            storey: { ...storey, ...timeAgo,
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
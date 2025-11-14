"use strict"

const postBookmark = require('./bookmark.post.model')
const postModel = require('../posts/post.model')
const response = require('../../../helpers/response.helper')

module.exports.bookmarkPost = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params; // this id => post._id

        const isExistPost = await postModel.findById(id).lean()

        if (!isExistPost) return response(res, 404, "post not found. or has already been removed.")

        const isExistUserBookmark = await postBookmark.findOne({ user: user._id, post: id }).lean()

        if (isExistUserBookmark) {
            await postBookmark.deleteOne({_id: isExistUserBookmark._id})
            return response(res, 200, "post removed from bookmark")
        }

        await postBookmark.create({
            post: id,
            user: user._id
        })

        return response(res, 200, "post bookmarked successfully")
    }
    catch (error) {
        next(error)
    }
}
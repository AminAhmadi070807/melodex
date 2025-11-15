"use strict"

const postBookmark = require('./bookmark.post.model')
const postModel = require('../posts/post.model')
const response = require('../../../helpers/response.helper')
const timeFormat = require('../../../utils/time.util')
const userTagsPostModel = require("../userTags/userTags.model");

const timeFormatSetter = async (bookmarks) => {
    const bookmarkArray = []

    for (const bookmark of bookmarks) {
        const timeAgo = await timeFormat(bookmark.post.createdAt, bookmark.post.createdAt);

        bookmarkArray.push({
            ...bookmark.post,
            ...timeAgo

        });
    }

    return bookmarkArray;
}

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

        for (const tag of isExistPost.tags) {
            await userTagsPostModel.findOneAndUpdate({ user: user._id, tag}, {
                    user: user._id,
                    tag,
                    $inc: {
                        score: 5
                    }
                },
                {new: true, upsert: true}
            )
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

module.exports.userBookmarkPost = async (req, res, next) => {
    try {
        const { page = 1, limit = 25 } = req.query

        const user = req.user;

        const bookmarks = await postBookmark.find({ user: user._id }, 'post').sort({ _id: -1 }).populate('post').populate({ path: "post", populate: { path: "user", model: "User", select: "fullName username profile" } }).limit(+page * +limit).lean()

        const bookmarksArray = await timeFormatSetter(bookmarks)

        return response(res, 200, "post bookmarks successfully", { bookmarks: bookmarksArray })
    }
    catch (error) {
        next(error)
    }
}
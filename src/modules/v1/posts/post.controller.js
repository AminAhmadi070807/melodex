"use strict";

const postModel = require('./post.model')
const tagsModel = require('../tags/tags.model')
const followModel = require('../follow/follow.model')
const likeModel = require('../like/like.post.model')
const userTagsModel = require('../userTags/userTags.model')
const commentsModel = require('../comments/comment.model')
const bookmarksModel = require('../bookmark/bookmark.model')
const fileDeleter = require("../../../utils/delete.file.util");
const response = require("../../../helpers/response.helper");
const formatTimeAgo = require('../../../utils/time.util')

module.exports.upload = async (req, res, next) => {
    try {
        const user = req.user;

        const posts = []
        if (req.files) {
            const files = req.files

            for (const file of files) posts.push(`/uploads/posts/${file.filename}`);
        }

        if (posts.length === 0) return response(res, 422, "place first upload a post")

        req.body.tags = req.body.tags.match(/#([\p{L}\p{N}_]+)/gu)

        const upload = await postModel.create({
            user: user._id,
            routes: posts,
            ...req.body
        })

        for (const tag of req.body.tags) {
            await tagsModel.findOneAndUpdate({ title: tag }, {
                $setOnInsert: { title: tag },
                $push: {
                    posts: upload._id
                }
            }, { new: true, upsert: true })
        }

        return response(res, 201, "Create new post successfully", upload)
    }
    catch (error) {
        for (const file of req.files) await fileDeleter('public', file.filename);
        next(error);
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const remove = await postModel.findOneAndDelete({ _id: id, user: user._id });

        if (!remove) return response(res, 404, "post not found or has already been removed.")

        if (remove.routes.length) for (const file of remove.routes) await fileDeleter('public', file);

        await likeModel.deleteMany({ post: id })
        await commentsModel.deleteMany({ post: id })
        await bookmarksModel.deleteMany({ post: id })

        return response(res, 200, "remove post successfully")
    }
    catch (error) {
        next(error);
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const posts = []
        if (req.files) {
            const files = req.files

            for (const file of files) posts.push(`/uploads/posts/${file.filename}`);
        }

        if (posts.length === 0) return response(res, 422, "place first upload a post")

        const upload = await postModel.findOneAndUpdate({ _id: id, user: user._id }, {
            routes: posts,
            ...req.body
        }).lean()

        if (!upload) return response(res, 404, "post not found or has already been removed.")

        for (const tag of req.body.tags) {
            await tagsModel.findOneAndUpdate({ title: tag }, {
                $setOnInsert: { title: tag },
                $push: {
                    posts: upload._id
                }
            }, { new: true, upsert: true })
        }

        for (const file of upload.routes) await fileDeleter('public', file);

        return response(res, 200, "update user information successfully", upload)
    }
    catch (error) {
        for (const file of req.files) await fileDeleter('public', file.filename);
        next(error);
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user

        let post = await postModel.findById(id).populate("music").populate("user", '-role -password -phone').lean()

        if (!post) return response(res, 404, "post not found or has already been removed.")

        if (post.user.settings?.Private === "PRIVATE" && post.user._id.toString() !== user._id.toString()) {
            const isFollowed = await followModel.findOne({ follower: post.user._id, following: user._id }).lean()

            if (!isFollowed) return response(res, 403, "This page is private. you don't follow this user.")
        }

        const numberOfLikePost = await likeModel.countDocuments({ post: post._id })

        const numberOfCommentPost = await commentsModel.countDocuments({ post: id, isAnswer: false })

        const numberOfBookmarkPost = await bookmarksModel.countDocuments({ post: id })

        const timeAgo = formatTimeAgo(post.createdAt, post.updatedAt)

        return response(res, 200, null, { post: { ...post, ...timeAgo, likes : numberOfLikePost, numberOfCommentPost, numberOfBookmarkPost , user: { ...post.user, settings: undefined } } })
    }
    catch (error) {
        next(error);
    }
}

module.exports.getReels = async (req, res, next) => {
    try {
        const user = req.user;

        const userTags = await userTagsModel.find({ user: user._id }, 'tag').sort({ score: -1 }).lean()

        const userTagsArray = userTags.map(tag => tag.tag)

        const posts = await postModel.find({
            tags: { $in : userTagsArray }
        }).sort({ _id: -1 }).select("_id").lean()

        return response(res, 200, null, posts);
    }
    catch (error) {
        next(error);
    }
}

module.exports.explore = async (req, res, next) => {
    try {
        const posts = await postModel.find({}).sort({ _id: -1 }).lean()

        const postArray = []
        for (const post of posts) {
            const comments = await commentsModel.countDocuments({ isAnswer: false, post: post._id }).lean()
            const likes = await likeModel.countDocuments({ post: post._id }).lean()
            postArray.push({
                ...post,
                numberOfComments: comments,
                numberOfLike: likes,
                totalCount: comments + likes
            })
        }

        const explore = postArray.sort((a, b) => a.totalCount > b.totalCount ? -1 : 1)

        return response(res, 200, null, {  explore })

    }
    catch (error) {
        next(error);
    }
}
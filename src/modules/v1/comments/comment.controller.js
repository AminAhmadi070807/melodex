"use strict"

const commentPostModel = require('./comment.post.model')
const commentMusicModel = require('./comment.music.model')
const postModel = require('./../posts/post.model')
const musicMp3Model = require('./../musics/mp3/music.model')
const userTagsPostModel = require('../userTags/userTags.model')
const {isValidObjectId} = require("mongoose");
const response = require('../../../helpers/response.helper')
const timeFormat = require('../../../utils/time.util')

const timeFormatSetter = async (comments) => {
    const commentsArray = []

    for (const comment of comments) {
        const timeAgo = await timeFormat(comment.createdAt, comment.createdAt);

        commentsArray.push({
            ...comment,
            ...timeAgo
        });
    }

    return commentsArray;
}

module.exports.commentPost = async (req, res, next) => {
    try {
        const user = req.user;
        const { id, content } = req.body;

        if (!isValidObjectId(post)) return response(res, 422, "id is not correct")

        const isAvailablePost = await postModel.findById(post).lean()

        if (!isAvailablePost) return response(res, 404, "post not found. or has already been removed")

        for (const tag of isAvailablePost.tags) {
            await userTagsPostModel.findOneAndUpdate({ user: user._id, tag}, {
                    user: user._id,
                    tag,
                    $inc: {
                        score: 2
                    }
                },
                {new: true, upsert: true}
            )
        }

        await commentPostModel.create({
            user: user._id,
            content,
            post,
        })

        return response(res, 201, "created new comment to post successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.answerCommentPost = async (req, res, next) => {
    try {
        const user = req.user;
        const { content } = req.body;
        const { id } = req.params;

        if (!isValidObjectId(id)) return response(res, 422, "objectId is not correct")

        const isAvailableComment = await commentPostModel.findById(id).populate('post').lean()

        if (!isAvailableComment) return response(res, 404, "comment not found. or has already been removed")

        for (const tag of isAvailableComment.post.tags) {
            await userTagsPostModel.findOneAndUpdate(
                {user: user._id, tag}, {
                    user: user._id,
                    tag,
                    $inc: {
                        score: 2
                    }
                },
                {new: true, upsert: true}
            )
        }

        await commentPostModel.create({
            user: user._id,
            isAnswer: true,
            post: isAvailableComment.post,
            content,
            parent: id
        })

        return response(res, 201, "answer to comment successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.getAllCommentsPost = async (req, res, next) => {
    try {
        const comments = await commentPostModel.find({ post: req.params.id, isAnswer: false }, '-post').populate("user", 'profile fullName username').sort({ _id: -1 }).lean()

        const commentsArray = await timeFormatSetter(comments)

        return response(res, 200, null, { comments: commentsArray })
    }
    catch (error) {
        next(error)
    }
}

module.exports.getAllAnswerCommentsPost = async (req, res, next) => {
    try {
        const answersComment = await commentPostModel.find({ parent: req.params.id, isAnswer: true }, '-post').populate("user", 'profile fullName username').sort({ _id: -1 }).lean()

        const comments = await timeFormatSetter(answersComment)

        return response(res, 202, null, { comments })
    }
    catch (error) {
        next(error)
    }
}

module.exports.removeCommentPost = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const userAccessRemoveComment = await commentPostModel.findOne({ _id: id, user: user._id }).populate("post", 'user').lean()

        if (!userAccessRemoveComment || user._id.toString() !== userAccessRemoveComment.post.user.toString()) return response(res, 403, "You cannot delete other people's comments.")

        const remove = await commentPostModel.findByIdAndDelete(id)

        if (!remove) return response(res, 404, "Comment not found. or has already been removed.")

        await commentPostModel.findOneAndDelete({ parent: id })

        return response(res, 200, "deleted comment successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.commentMusic = async (req, res, next) => {
    try {
        const user = req.user;
        const { id, content } = req.body;

        if (!isValidObjectId(id)) return response(res, 422, "id is not correct")

        const isAvailablePost = await musicMp3Model.findById(id).lean()

        if (!isAvailablePost) return response(res, 404, "music not found. or has already been removed")

        for (const tag of isAvailablePost.tags) {
            await userTagsPostModel.findOneAndUpdate({ user: user._id, tag}, {
                    user: user._id,
                    tag,
                    $inc: {
                        score: 2
                    }
                },
                {new: true, upsert: true}
            )
        }

        await commentMusicModel.create({
            user: user._id,
            content,
            music: id,
        })

        return response(res, 201, "created new comment to music successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.answerCommentMusic = async (req, res, next) => {
    try {
        const user = req.user;
        const { content } = req.body;
        const { id } = req.params;

        if (!isValidObjectId(id)) return response(res, 422, "objectId is not correct")

        const isAvailableComment = await commentMusicModel.findById(id).populate('music').lean()

        if (!isAvailableComment) return response(res, 404, "comment not found. or has already been removed")

        for (const tag of isAvailableComment.music.tags) {
            await userTagsPostModel.findOneAndUpdate(
                {user: user._id, tag}, {
                    user: user._id,
                    tag,
                    $inc: {
                        score: 2
                    }
                },
                {new: true, upsert: true}
            )
        }

        await commentMusicModel.create({
            user: user._id,
            isAnswer: true,
            music: isAvailableComment.music,
            content,
            parent: id
        })

        return response(res, 201, "answer to comment successfully.")
    }
    catch (error) {
        next(error)
    }
}

module.exports.getAllCommentsMusic = async (req, res, next) => {
    try {
        const comments = await commentMusicModel.find({ music: req.params.id, isAnswer: false }, '-music').populate("user", 'profile fullName username').sort({ _id: -1 }).lean()

        const commentsArray = await timeFormatSetter(comments)

        return response(res, 200, null, { comments: commentsArray })
    }
    catch (error) {
        next(error)
    }
}

module.exports.getAllAnswerCommentsMusic = async (req, res, next) => {
    try {
        const answersComment = await commentMusicModel.find({ parent: req.params.id, isAnswer: true }, '-music').populate("user", 'profile fullName username').sort({ _id: -1 }).lean()

        const comments = await timeFormatSetter(answersComment)

        return response(res, 200, null, { comments })
    }
    catch (error) {
        next(error)
    }
}

module.exports.removeCommentMusic = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const userAccessRemoveComment = await commentMusicModel.findOne({ _id: id, user: user._id }).populate("music", 'user').lean()

        if (!userAccessRemoveComment || user._id.toString() !== userAccessRemoveComment.music.user.toString()) return response(res, 403, "You cannot delete other people's comments.")

        const remove = await commentMusicModel.findByIdAndDelete(id)

        if (!remove) return response(res, 404, "Comment not found. or has already been removed.")

        await commentMusicModel.findOneAndDelete({ parent: id })

        return response(res, 200, "deleted comment successfully.")
    }
    catch (error) {
        next(error)
    }
}
"use strict";

const likeModel = require("./like.post.model");
const tagsModel = require("../tags/tags.post.model");
const userTagsModel = require("../userTags/post/userTags.post.model");
const response = require("../../../helpers/response.helper");

module.exports.likePost = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        await likeModel.findOneAndUpdate({ user: user._id, post: id }, {
            user: user._id, post: id
        }, { new: true, upsert: true })

        const tags = await tagsModel.find({ posts: { $in: [id] } }).select('title')

        for (const tag of tags) await userTagsModel.findOneAndUpdate({ user: user._id, tag: tag.title }, {
                user: user._id,
                tag: tag.title,
                $inc: {
                    score: 1
                }
            }, { new: true, upsert: true })

        return response(res, 200, "post liked successfully");
    }
    catch (error) {
        next(error);
    }
}

module.exports.disLikePost = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;

        await likeModel.findOneAndDelete({ user: user._id, post: id })

        const tags = await tagsModel.find({ posts: { $in: [id] } }).select('title')

        for (const tag of tags) await userTagsModel.findOneAndUpdate({ user: user._id, tag: tag.title }, [{
            $set: {
                user: user._id,
                tag: tag.title,
                score: {
                    $cond: [
                        { $gt: ["$score", 1] },
                        { $subtract: ["$score", 2] },
                        "$score",
                    ]
                }
            }
        }])

        return response(res, 200, "post disliked successfully");
    }
    catch (error) {
        next(error);
    }
}
"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    route: {
        type: String,
        required: true,
        trim: true,
    },
    poster: [{
        type: String,
        required: true,
        trim: true,
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: {
        type: [{
            type: String,
            required: true,
            trim: true
        }],
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    isPrivate: {
        type: String,
        required: true,
        trim: true,
        enum: ["ALL", "NONE", 'FOLLOWERS', 'PRIVATE']
    },
    allowComments: {
        type: String,
        required: true,
        trim: true,
        enum: ["ALL", "NONE", 'FOLLOWERS', 'PRIVATE']
    },
    disableLike: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true })

module.exports = mongoose.model("mp4Music", schema)
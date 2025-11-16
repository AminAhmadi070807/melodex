"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
        required: false,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [{
            type: String,
            required: true,
            trim: true
        }],
    },
    caption: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: false,
        trim: true,
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
    isPrivate: {
        type: String,
        required: true,
        trim: true,
        enum: ["ALL", "NONE", 'FOLLOWERS', 'PRIVATE']
    },
    routes: {
        type: [
            {
                type: String,
                required: true,
                trim: true,
            }
        ]
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", schema)
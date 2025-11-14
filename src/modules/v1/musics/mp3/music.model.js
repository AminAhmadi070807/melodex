"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      max: 60,
    },
    route: {
        type: String,
        required: true,
        trim: true,
    },
    poster: {
        type: String,
        required: true,
        trim: true,
    },
    covers: [{
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
    artist: [{
        type: String,
        required: true,
        trim: true,
    }],
    releaseDate: {
        type: Date,
        required: true,
    },
    language: {
        type: String,
        required: true,
        trim: true,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: false,
    }, // TODO add model to project
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        required: false,
    } // TODO add playlist model to project
}, { timestamps: true })

module.exports = mongoose.model("mp4Music", schema)
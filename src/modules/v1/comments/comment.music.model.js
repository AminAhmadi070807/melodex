"use strict"

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mp3Music',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isAnswer: {
        type: Boolean,
        default: false,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicComment',
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("MusicComment", schema)
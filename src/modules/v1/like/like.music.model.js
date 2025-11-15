"use strict"

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mp3Music",
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("LikeMusic", schema);
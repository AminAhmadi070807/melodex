"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tag: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    }
}, { timestamps: true });

module.exports = mongoose.model("UserTag", schema);
"use strict"

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    route: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    viewer: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
    },
}, { timestamps: true });

module.exports = mongoose.model('Stories', schema);
"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    posts: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                required: true,
            }
        ],
    }
}, { timestamps: true });

module.exports = mongoose.model("Tag", schema);
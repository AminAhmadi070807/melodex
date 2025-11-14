"use strict"

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        trim: true,
    },
    expireAt: {
        type: Date,
        required: true,
        trim: true,
        default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', schema)
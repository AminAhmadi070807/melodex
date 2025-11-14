"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    expire: {
        type: String,
        required: true,
        enum: ["Block", "Timeout"],
        default: "Timeout",
    },
    expireAt: {
        type: Date,
        required: true,
        default: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    }
}, { timestamps: true })

schema.index({ expireAt: -1}, { expireAfterSeconds: 0 })

module.exports = mongoose.model("Ban", schema)
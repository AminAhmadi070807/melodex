"use strict"

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    authority: {
        type: String,
        required: true,
        trim: true,
    },
    verify: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", schema);
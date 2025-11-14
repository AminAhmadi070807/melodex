"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    durationMonths: {
        type: Number,
        default: 1,
    },
    price: {
       type: Number,
       required: true,
    },
    members: {
        type: Number,
        required: true,
        default: 1,
        max: 6
    },
    plan: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        max: 80,
        min: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("Plan", schema);
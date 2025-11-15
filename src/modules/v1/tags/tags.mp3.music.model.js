"use strict"

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    musics: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Mp3Music",
                required: true,
            }
        ],
    }
}, { timestamps: true });

module.exports = mongoose.model("Mp3MusicTag", schema);
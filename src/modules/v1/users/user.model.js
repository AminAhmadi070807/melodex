"use strict";
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["ACTIVE", 'EXPIRED'],
    },
    price: {
        type: Number,
        required: true,
    },
    discountCode: {
        type: String,
        required: false,
    },
    startPlan: {
        type: Date,
        required: true,
        default: new Date(),
    },
    endPlan: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const settingChanelSchema = new mongoose.Schema({
    Private: {
        type: String,
        enum: ["PRIVATE", 'PUBLIC'],
        default: 'PUBLIC',
        required: true,
    },
    ShowProfile: {
        type: String,
        enum: ["All", 'FOLLOWERS'],
        default: "All",
        required: true,
    },
    ShowStories: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "All",
        required: true,
    },
    Comments: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "ALL",
        required: true,
    },
    Messages: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "All",
        required: true,
    },
    Uploads: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "PRIVATE",
        required: true,
    },
    Playlists: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "FOLLOWERS",
        required: true,
    },
    Analytics: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "PRIVATE",
        required: true,
    },
    showMonetization: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "PRIVATE",
        required: true,
    },
    Monetization: {
        type: String,
        enum: ["All", 'FOLLOWERS', 'PRIVATE'],
        default: "PRIVATE",
        required: true,
    },
}, { timestamps: true });

const usersBlocked = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const schema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    role: [{
        type: String,
        required: true,
        enum: ['ADMIN', 'USER', "CONTENT-MODERATOR", 'BOT', 'ADOPS', 'EDITOR', "INVESTOR"],
        default: 'USER',
    }],
    bio: {
        type: String,
        required: false,
        trim: true,
        default: 'NULL',
    },
    profile: {
        type: [{
            type: String,
            required: true
        }]
    },
    fullName: {
        type: String,
        required: false,
        trim: true,
        default: "NULL"
    },
    password: {
        type: String,
        required: false,
        trim: true,
    },
    plan: {
        type: [planSchema],
    },
    settings: {
        type: settingChanelSchema,
    },
    blocked: {
        type: [usersBlocked]
    },
    username: {
        type: String,
        required: true,
        trim: true,
        default: "NULL"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", schema);
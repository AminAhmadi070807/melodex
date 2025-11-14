"use strict"

const Joi = require('joi')

module.exports.update = Joi.object().keys({
    bio: Joi.string().max(255).required(),
    fullName: Joi.string().max(50).required(),
    username: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9_-]{8,24}$')).max(24).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')).required(),
})

module.exports.updateSettings = Joi.object().keys({
    Private: Joi.string().valid("PRIVATE", 'PUBLIC').required(),
    ShowProfile: Joi.string().valid("All", 'FOLLOWERS').required(),
    ShowStories: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Comments: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Messages: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Uploads: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Playlists: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Analytics: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    Monetization: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
    showMonetization: Joi.string().valid("All", 'FOLLOWERS', 'PRIVATE').required(),
})
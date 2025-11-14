"use strict";

const Joi = require('joi');
const { isValidObjectId } = require("mongoose");

module.exports = Joi.object().keys({
    music: Joi.string().custom((value, helpers) => {
        if (!isValidObjectId(value)) return helpers.message("any.invalid", "musicId is not correct")

        return value
    }).optional(),
    description: Joi.string().required(),
    tags: Joi.string().required(),
    caption: Joi.string().required(),
    location: Joi.string().optional(),
    allowComments: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required(),
    disableLike: Joi.boolean().required(),
    isPrivate: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required(),
})
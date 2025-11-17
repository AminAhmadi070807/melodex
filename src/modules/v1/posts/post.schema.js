"use strict";

const Joi = require('joi');

module.exports = Joi.object().keys({
    description: Joi.string().required(),
    tags: Joi.string().required(),
    caption: Joi.string().required(),
    location: Joi.string().optional(),
    allowComments: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required(),
    disableLike: Joi.boolean().required(),
    isPrivate: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required(),
})
"use strict";

const Joi = require("joi");

module.exports.banned = Joi.object().keys({
    phone: Joi.string().regex(new RegExp('^09(0[1-5]|1\\d|2[0-2]|3\\d|9[^567])\\d{7}$')).messages({
        "string.pattern.base": "Please enter a valid phone number."
    }).required(),
    expire: Joi.string().valid("Block", "Timeout").required(),
})

module.exports.pagination = Joi.object().keys({
    page: Joi.number().integer().optional(),
    limit: Joi.number().valid(10, 25, 50, 75, 100).integer().optional(),
    expire: Joi.string().valid("Block", "Timeout").optional(),
})
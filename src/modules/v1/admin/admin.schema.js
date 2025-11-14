"use strict"

const Joi = require('joi')

module.exports.updateRole = Joi.object().keys({
    level: Joi.number().min(1).max(8).required(),
    phone: Joi.string().regex(new RegExp('^09(0[1-5]|1\\d|2[0-2]|3\\d|9[^567])\\d{7}$')).messages({
        "string.pattern.base": "Please enter a valid phone number."
    }).required(),
})
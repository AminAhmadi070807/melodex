"use strict"

const Joi = require('joi')

module.exports.sendCode = Joi.object().keys({
    phone: Joi.string().regex(new RegExp('^09(0[1-5]|1\\d|2[0-2]|3\\d|9[^567])\\d{7}$')).messages({
        "string.pattern.base": "Please enter a valid phone number."
    }).required(),
})

module.exports.verifyCode = Joi.object().keys({
    code: Joi.string().min(6).max(6).pattern(new RegExp('^\\d+$')).messages({
        "string.pattern.base": "only numbers are allowed."
    }).required(),
    phone: Joi.string().regex(new RegExp('^09(0[1-5]|1\\d|2[0-2]|3\\d|9[^567])\\d{7}$')).messages({
        "string.pattern.base": "Please enter a valid phone number."
    }).required(),
})
"use strict"

const Joi = require("joi");

module.exports.commentPostSchema = Joi.object().keys({
    id: Joi.string().optional(),
    content: Joi.string().required(),
})
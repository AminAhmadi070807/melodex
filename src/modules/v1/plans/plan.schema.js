"use strict"

const Joi = require('joi')

module.exports.createPlanSchema = Joi.object().keys({
    durationMonths: Joi.number().required(),
    price: Joi.number().required(),
    members: Joi.number().max(6).required(),
    plan: Joi.string().required(),
    discount: Joi.number().min(0).max(80).required(),
})

module.exports.updatePlanSchema = Joi.object().keys({
    durationMonths: Joi.number().optional(),
    price: Joi.number().optional(),
    members: Joi.number().max(6).optional(),
    plan: Joi.string().optional(),
    discount: Joi.number().min(0).max(80).optional(),
})
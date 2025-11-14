"use strict"

const Joi = require('joi');

module.exports.uploadMp3MusicSchema = Joi.object().keys({
    title: Joi.string().max(60).required(),
    tags: Joi.string().min(30).required() ,
    description: Joi.string().max(500).required() ,
    isPrivate: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required() ,
    allowComments: Joi.string().valid("ALL", "NONE", 'FOLLOWERS', 'PRIVATE').required() ,
    disableLike: Joi.boolean().required() ,
    artist: Joi.string().required() ,
    releaseDate: Joi.date().required() ,
    language: Joi.string().required() ,
    album: Joi.string().optional() ,
    playlist: Joi.string().optional() ,
})
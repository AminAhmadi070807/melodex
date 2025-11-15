"use strict"

const adminSchema = require('../modules/v1/admin/admin.schema')
const authSchema = require('./../modules/v1/auth/auth.schema')
const userSchema = require('./../modules/v1/users/user.schema')
const { createPlanSchema, updatePlanSchema } = require('./../modules/v1/plans/plan.schema')
const banSchema = require('../modules/v1/bans/ban.schema')
const postSchema = require('../modules/v1/posts/post.schema')
const { commentPostSchema } = require('../modules/v1/comments/comment.schema')
const { uploadMp3MusicSchema } = require('../modules/v1/musics/music.schema')

module.exports.authPhoneValidator = async (req, res, next) => {
    try {
        await authSchema.sendCode.validateAsync({ phone: req.body.phone })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.authGetCodeValidator = async (req, res, next) => {
    try {
        await authSchema.verifyCode.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.userValidator = async (req, res, next) => {
    try {
        await userSchema.update.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.userUpdateSetting = async (req, res, next) => {
    try {
        await userSchema.updateSettings.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.updateRoleValidator = async (req, res, next) => {
    try {
        await adminSchema.updateRole.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.createPlanValidator = async (req, res, next) => {
    try {
        await createPlanSchema.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.updatePlanValidator = async (req, res, next) => {
    try {
        await updatePlanSchema.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.banValidator = async (req, res, next) => {
    try {
        await banSchema.banned.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.banPaginationValidator = async (req, res, next) => {
    try {
        await banSchema.pagination.validateAsync({ ...req.query })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.postValidator = async (req, res, next) => {
    try {
        await postSchema.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.commentValidator = async (req, res, next) => {
    try {
        await commentPostSchema.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}

module.exports.uploadMp3MusicValidator = async (req, res, next) => {
    try {
        await uploadMp3MusicSchema.validateAsync({ ...req.body })

        return next()
    }
    catch (error) {
        next(error)
    }
}
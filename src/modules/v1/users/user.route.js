"use strict"

const router = require("express").Router()
const multer = require("multer")
const diskStorage = require('../../../utils/upload.util')

const controller = require('./user.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

const uploader = multer({ storage: diskStorage("profiles"), limit: { fileSize: 10 * 1024 * 1024} })

router.route('/').patch(uploader.single("profile"), validator.userValidator ,authGuard, controller.update)

router.route('/settings').patch(validator.userUpdateSetting, authGuard, controller.updateSettings).get(authGuard, controller.getSettings)

router.route('/Me').get(authGuard, controller.getMe)

router.route('/logout').post(authGuard, controller.logout)

router.route('/:id').get(authGuard, idGuard, controller.getOne)

router.route('/remove-profile').delete(authGuard, controller.removeProfile)

module.exports = router
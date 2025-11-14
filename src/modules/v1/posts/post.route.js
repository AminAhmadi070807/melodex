"use strict"

const router = require("express").Router()
const multer = require("multer")
const diskStorage = require('../../../utils/upload.util')

const controller = require('./post.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

const uploader = multer({ storage: diskStorage("posts"), limit: { fileSize: 200 * 1024 * 1024} })

router.route('/')
    .post(authGuard, uploader.array("posts", 100), validator.postValidator, controller.upload)
    .get(authGuard, controller.explore)

router.route('/reels').get(authGuard, controller.getReels)

router.route('/:id')
    .delete(authGuard, idGuard, controller.remove)
    .patch(authGuard, idGuard ,uploader.array("posts", 100), controller.update)
    .get(authGuard, idGuard, controller.getOne)

module.exports = router
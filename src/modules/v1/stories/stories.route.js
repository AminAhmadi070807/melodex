"use strict";

const express = require("express");
const router = express.Router();

const controller = require('./stories.controller')
const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

const multer = require("multer");
const diskStorage = require("../../../utils/upload.util");

const uploader = multer({ storage: diskStorage("stories"), limit: { fileSize: 30 * 1024 * 1024 } })

router.use(authGuard)

router.route('/').post(uploader.array('stories', 100), controller.upload)

router.route('/:id').get(idGuard, controller.getOne).delete(idGuard, controller.remove)

router.route('/user/feed').get(controller.feedStories)

router.route('/user/:id').get(idGuard, controller.userStories)

module.exports = router;
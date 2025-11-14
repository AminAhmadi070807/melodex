"use strict"

const express = require("express")
const router = express.Router()

const controller = require('./music.controller')
const validator = require('../music.schema')
const authGuard = require('../../../../middlewares/guard/auth.guard')
const idGuard = require('../../../../middlewares/guard/id.guard')
const multer = require("multer");
const diskStorage = require("../../../../utils/upload.util");

const uploader = multer({ storage: diskStorage("posts"), limit: { fileSize: 200 * 1024 * 1024} })

router.route('/').post(authGuard, uploader.single("music"), controller.upload)

module.exports = router
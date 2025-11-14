"use strict"

const express = require("express")
const router = express.Router()

const controller = require('./music.controller')
const validator = require('../../../../middlewares/validator.middleware')
const authGuard = require('../../../../middlewares/guard/auth.guard')
const idGuard = require('../../../../middlewares/guard/id.guard')
const multer = require("multer");
const diskStorage = require("../../../../utils/upload.util");

const uploader = multer({ storage: diskStorage("change") ,limit: { fileSize: 20 * 1024 * 1024} })

router.route('/').post(authGuard, uploader.fields([
    { name: 'musics', maxCount: 1 },
    { name: 'posters', maxCount: 1 },
    { name: 'covers', maxCount: 20 }
]),validator.uploadMp3MusicValidator, controller.upload)

module.exports = router
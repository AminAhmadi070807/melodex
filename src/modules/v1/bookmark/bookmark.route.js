"use strict"

const express = require('express');
const router = express.Router();

const controller = require('./bookmark.controller')
const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

router.route('/post').get(authGuard, controller.userBookmarkPost)
router.route('/post/:id').post(authGuard, idGuard, controller.bookmarkPost)

module.exports = router
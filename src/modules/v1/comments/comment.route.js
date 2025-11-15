"use strict"

const express = require('express');
const router = express.Router();

const controller = require('./comment.controller')
const validator = require('./../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

router.route('/post').post(validator.commentValidator ,authGuard, controller.commentPost)
router.route('/post/answer/:id').post(validator.commentValidator ,authGuard, idGuard, controller.answerCommentPost)

router.route('/post/all/comments/:id').get(idGuard, controller.getAllCommentsPost)
router.route('/post/all/answer/:id').get(idGuard, controller.getAllAnswerCommentsPost)

router.route('/post/:id').delete(authGuard, idGuard, controller.removeCommentPost)

router.route('/music').post(validator.commentValidator ,authGuard, controller.commentMusic)
router.route('/music/answer/:id').post(validator.commentValidator ,authGuard, idGuard, controller.answerCommentMusic)

router.route('/music/all/comments/:id').get(idGuard, controller.getAllCommentsMusic)
router.route('/music/all/answer/:id').get(idGuard, controller.getAllAnswerCommentsMusic)

router.route('/music/:id').delete(authGuard, idGuard, controller.removeCommentMusic)

module.exports = router
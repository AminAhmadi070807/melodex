"use strict"

const router = require("express").Router()

const controller = require('./follow.controller')

const authGuard = require('../../../middlewares/guard/auth.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

router.route('/:id')
    .post(authGuard, idGuard, controller.follow)
    .delete(authGuard, idGuard, controller.unFollow)

module.exports = router
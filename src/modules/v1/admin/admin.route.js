"use strict"

const router = require("express").Router()
const controller = require('./admin.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const roleGuard = require('../../../middlewares/guard/role.guard')

router.route('/').get(authGuard, roleGuard(["ADMIN"]) , controller.All)

router.route('/role').patch(validator.updateRoleValidator ,authGuard, roleGuard(["ADMIN"]), controller.updateRole)

module.exports = router
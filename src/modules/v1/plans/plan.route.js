"use strict"

const express = require("express")
const router = express.Router()

const controller = require('./plan.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const roleGuard = require('../../../middlewares/guard/role.guard')
const idGuard = require('../../../middlewares/guard/id.guard')

router.route('/')
    .post(validator.createPlanValidator ,authGuard, roleGuard(["ADMIN"]), controller.create)
    .get(controller.get)
    .delete(authGuard, roleGuard(["ADMIN"]), controller.remove)

router.route('/:id')
    .get(idGuard ,controller.getOne)
    .patch(validator.updatePlanValidator, authGuard, roleGuard(["ADMIN"]), idGuard, controller.update)

module.exports = router;
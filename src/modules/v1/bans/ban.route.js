"use strict"

const express = require("express");
const router = express.Router();

const controller = require('./ban.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require("../../../middlewares/guard/auth.guard")
const roleGuard = require("../../../middlewares/guard/role.guard")

router.use(authGuard, roleGuard("ADMIN"))

router.route('/')
    .post(validator.banValidator, controller.banAndUpdate)
    .get(validator.banPaginationValidator, controller.getAll)

router.route('/:id')
    .get(controller.getOne)
    .delete(controller.remove)

module.exports = router;
"use strict"

const router = require("express").Router();

const controller = require('./auth.controller')

const validator = require('./../../../middlewares/validator.middleware')

router.post("/send" ,validator.authPhoneValidator, controller.send)
router.post("/verify" ,validator.authGetCodeValidator, controller.verify)
router.post("/refresh" ,controller.refresh)

module.exports = router;
"use strict"

const express = require("express")
const router = express.Router()

const controller = require('./music.controller')
const validator = require('../music.schema')
const authGuard = require('../../../../middlewares/guard/auth.guard')
const idGuard = require('../../../../middlewares/guard/id.guard')


module.exports = router
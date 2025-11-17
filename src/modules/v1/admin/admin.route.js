"use strict"

const router = require("express").Router()
const controller = require('./admin.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const roleGuard = require('../../../middlewares/guard/role.guard')

router.use(authGuard, roleGuard(["ADMIN"]))

router.get('/', controller.AllAdmins)
router.get('/users', controller.AllUsers)
router.get('/bans', controller.AllBans)
router.get('/posts', controller.AllPosts)
router.get('/comments', controller.AllComments)
router.get('/stories', controller.AllStories)
router.get('/payments', controller.AllPayments)

router.patch('/role' ,validator.updateRoleValidator, controller.updateRole)

module.exports = router
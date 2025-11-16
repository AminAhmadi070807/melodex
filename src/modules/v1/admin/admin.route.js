"use strict"

const router = require("express").Router()
const controller = require('./admin.controller')

const validator = require('../../../middlewares/validator.middleware')
const authGuard = require('../../../middlewares/guard/auth.guard')
const roleGuard = require('../../../middlewares/guard/role.guard')

router.use(authGuard, roleGuard(["ADMIN"]))

router.get('/', controller.AllAdmins)
router.route('/users').get(controller.AllUsers)
router.route('/posts').get(controller.AllPosts)
router.route('/comments').get(controller.AllComments)
router.get('/stories', controller.AllStories)

router.route('/role').patch(validator.updateRoleValidator, controller.updateRole)

module.exports = router
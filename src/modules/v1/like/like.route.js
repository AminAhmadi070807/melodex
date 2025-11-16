"use strict";

const express = require("express");
const router = express.Router();

const controller = require("./like.controller");
const authGuard = require("../../../middlewares/guard/auth.guard");
const idGuard = require("../../../middlewares/guard/id.guard");

router.route('/post/:id')
    .post(authGuard, idGuard, controller.likePost)
    .delete(authGuard, idGuard, controller.disLikePost);

module.exports = router;
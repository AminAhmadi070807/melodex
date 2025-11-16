"use strict"

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const errorHandler = require('./src/middlewares/error.middleware.js')

const authRouter = require('./src/modules/v1/auth/auth.route')
const userRouter = require('./src/modules/v1/users/user.route')
const planRouter = require('./src/modules/v1/plans/plan.route')
const paymentRouter = require('./src/modules/v1/payment/payment.route')
const docsRouter = require('./src/modules/v1/docs/swagger.route')
const banRouter = require('./src/modules/v1/bans/ban.route')
const adminRouter = require('./src/modules/v1/admin/admin.route')
const followRouter = require('./src/modules/v1/follow/follow.route')
const postRouter = require('./src/modules/v1/posts/post.route')
const likeRouter = require('./src/modules/v1/like/like.route')
const commentRouter = require('./src/modules/v1/comments/comment.route')
const bookmarkRouter = require('./src/modules/v1/bookmark/bookmark.route')

const app = express()

//* middleware
app.use(express.static('public'))
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//* routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/plans', planRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1/bans', banRouter)
app.use('/api/v1/admins', adminRouter)
app.use('/api/v1/follows', followRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/bookmarks', bookmarkRouter)
app.use('/api/docs', docsRouter)

app.use((req, res, next) => res.status(404).json({ status: 404, message: "Api not found" }))

app.use(errorHandler)

module.exports = app
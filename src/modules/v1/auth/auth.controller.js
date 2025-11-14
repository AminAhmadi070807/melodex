"use strict"

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userModel = require('../users/user.model')
const refreshTokenModel = require('../token/refresh.token.model')
const banModel = require('./../bans/ban.model')
const redis = require('../../../database/Redis/db')
const configs = require('../../../config/config.env')

const response = require('../../../helpers/response.helper')
const otpGenerate = require('../../../helpers/otp-code-generate.helper')
const receiveOtpCode = require('../../../helpers/receive-otp-code.helper')
const smsService = require('../../../services/sms.service')
const tokenGenerator = require('../../../helpers/token.helper')

const token = async (res, user_id) => {
    try {
        const { accessToken, refreshToken, status, hashRefreshToken } = await tokenGenerator(user_id)

        if (status !== 200) return { status, message: "Problem in generate token" }

        const isExistToken = await refreshTokenModel.findOneAndUpdate({ user: user_id }, {
            token: hashRefreshToken,
            user: user_id
        }).lean()

        if (!isExistToken) {
            await refreshTokenModel.create({
                token: hashRefreshToken,
                user: user_id,
            })
        }

        res.cookie('access-token', accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refresh-token', refreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        return { status: 200 }
    }
    catch (error) {
        return { status: 500 , message: "OoOps Unknown server error" }
    }
}

module.exports.send = async (req, res, next) => {
    try {
        const { phone } = req.body

        const isBanedPhone = !!(await banModel.findOne({ phone }).lean())

        if (isBanedPhone) return response(res, 403, "phone number is banned.")

        const receiveOtp = await receiveOtpCode(phone)

        if (receiveOtp.status !== 404) return response(res, receiveOtp.status, receiveOtp.message)

        const otpCode = await otpGenerate(phone)

        if (configs.production === 'production') {
            const sms = await smsService(phone, otpCode.otp.toString())

            if (sms?.status !== 200) return response(res, sms.status, sms.message)

            return response(res, sms?.status, sms.message)
        }
        else {
            return response(res, 200,`Send otp code successfully to phone number ${phone}`, otpCode)
        }

    }
    catch (error) {
        next(error)
    }
}

module.exports.verify = async (req, res, next) => {
    try {
        const { phone, code } = req.body

        const otpCode = await receiveOtpCode(phone)

        if (otpCode.status !== 409) return response(res, otpCode.status, otpCode.message)

        if (otpCode.otp !== code) {
            await redis.del(`otp:${phone}`)
            return response(res, 400, "otp code not equal")
        }
        await redis.del(`otp:${phone}`)

        const userCounts = await userModel.countDocuments({})

        const isExistPhoneNumber = await userModel.findOne({ phone }).lean()

        if (isExistPhoneNumber) {
            const { status, message } = await token(res, isExistPhoneNumber._id.toString())

            if (status !== 200) return response(res, status, message)

            return response(res, 200, "You have successfully logged in.")
        }

        const user = await userModel.create({
            phone,
            role : userCounts ? "USER": "ADMIN",
        })

        const { status, message } = await token(res, user._id.toString())

        if (status !== 200) return response(res, status, message)

        return response(res, 201, "You have successfully registered.", user)
    }
    catch (error) {
        next(error)
    }
}

module.exports.refresh = async (req, res, next) => {
    try {
        const { 'refresh-token': refreshToken } = req.cookies

        if (!refreshToken) return response(res, 401, "User not authorized")

        const userToken = await jwt.verify(refreshToken, configs.auth.refreshTokenSecretKey)

        const user = await refreshTokenModel.findOne({ user: userToken._id }).sort({ _id: -1 }).lean()

        if (!user) return response(res, 401, "user not authorized")

        const isBanned = await banModel.findOne({ phone: user.phone }).lean()

        if (isBanned) return response(res, 403, "user id banned.")

        const isExistToken = await bcrypt.compare(refreshToken, user.token)

        if (!isExistToken) return response(res, 409, "Refresh token is not acceptable")

        const { status, message } = await token(res, userToken._id)

        if (status !== 200) return response(res, status, message)

        return response(res, 200, "new token generated successfully.")
    }
    catch (error) {
        next(error)
    }
}
"use strict"

const redis = require('./../database/Redis/db')
const crypto = require("crypto")

module.exports = async (phone) => {
    try {
        const otp = crypto.randomInt(100_000, 999_999)

        await redis.set(`otp:${phone}`, otp, "EX", 180)

        return { status: 200, message: "OK", otp }
    }
    catch (error) {
        throw error;
    }
}
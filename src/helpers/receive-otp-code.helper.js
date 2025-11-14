"use strict"

const redis = require('./../database/Redis/db')

module.exports = async (phone) => {
    try {
        const verifyCode = await redis.get(`otp:${phone}`)

        if (!verifyCode) return { status: 404, message: "Otp code not found or expired." }

        const ttl = await redis.ttl(`otp:${phone}`)

        return { status: 409, message: `${ttl} seconds left to resubmit.`, otp: verifyCode }
    }
    catch (error) {
        throw error;
    }
}
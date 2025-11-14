"use strict"

module.exports = {
    port: process.env.REDIS_PORT || 3000,
    database: {
        mongoDB: {
            uri: process.env.MONGODB_URI,
        },
        redis: {
            uri: process.env.REDIS_URI,
        }
    },
    auth: {
        refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
        accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    },
    production: process.env.DEV_MODE,
    sms: {
        username: process.env.FARAZ_SMS_USERNAME,
        password: process.env.FARAZ_SMS_PASSWORD,
        fromNumber: process.env.FARAZ_SMS_FROM_NUMBER,
        patternCode: process.env.FARAZ_SMS_PATTERN_CODE,
        patternName: process.env.FARAZ_SMS_PATTER_NAME,
    },
    zarinpal: {
        baseUrl: process.env.PAYMENT_ZARINPAL_BASE_URL,
        merchant_id: process.env.PAYMENT_ZARINPAL_MERCHANT_ID,
        callbackUrl: process.env.PAYMENT_ZARINPAL_CALLBACK_URL,
        callbackBaseUrl: process.env.PAYMENT_ZARINPAL_CALLBACK_BASE_URL,
    }
}
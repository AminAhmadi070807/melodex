"use strict"

const configs = require('../config/config.env')
const axios = require('axios')

module.exports.payment = async (price, description) => {
    try {
        console.log(price, description)

        const response = await axios.post(configs.zarinpal.baseUrl + "request.json", {
            merchant_id: configs.zarinpal.merchant_id,
            callback_url: configs.zarinpal.callbackUrl,
            amount: price,
            description,
            currency: "IRT"
        })

        const data = response.data.data;

        return data.code === 100 ? { status: 200, authority: data.authority, redirect: configs.zarinpal.callbackBaseUrl + data.authority } : { status: 200, error: response.data.errors };
    }
    catch (error) {
        return { status: error.status || 500, error: error.message || "OoOps Unknown server error" }
    }
}

module.exports.verified = async (price, authority) => {
    try {
        const response = await axios.post(configs.zarinpal.baseUrl + "verify.json", {
            merchant_id: configs.zarinpal.merchant_id,
            amount: price,
            authority
        })

        const data = response.data.data;

        return response.status === 200 ? { status: response.status, data } : { status: response.status, error: response.data.errors }
    }
    catch (error) {
        return { status: error.status || 500, error: error.message || "OoOps Unknown server error" }
    }
}
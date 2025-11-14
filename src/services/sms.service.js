"use strict"

const axios = require('axios')
const configs = require('../config/config.env')

module.exports = async (phone, code) => {
    try {
        await axios.post('https://ippanel.com/api/select', {
            op:"pattern",
            user:configs.sms.username,
            pass:configs.sms.password,
            fromNum:configs.sms.fromNumber,
            toNum:`${phone}`,
            patternCode:configs.sms.patternCode,
            inputData:[
                { [configs.sms.patternName]: code}
            ]
        })

        return { status: 200, message: `Send otp code successfully to phone number ${phone}` }
    }
    catch (error) {
        return { status: error.status || 500, message: error.message || "OoOps Unknown server error"}
    }
}
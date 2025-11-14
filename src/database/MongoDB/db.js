"use strict"

const configs = require('../../config/config.env')

const mongoose = require('mongoose')

;(async () => {
    try {
        await mongoose.connect(configs.database.mongoDB.uri)
        console.log({ status: 200, message: "Connected to database successfully" })
    }
    catch (err) {
        await mongoose.disconnect()
        console.log({ status: 500, message: err.message.replace(/^['"`]$/g, '') || "OoOps Unknown server error" })
    }
})()
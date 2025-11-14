"use strict"

const configs = require('../../config/config.env')
const Redis = require('ioredis')
const redis = new Redis(configs.database.redis.uri)

module.exports = redis


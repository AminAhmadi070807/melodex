"use strict"

// database
require('./src/database/MongoDB/db')
require('./src/database/Redis/db')

const app = require('./app')

const configs = require('./src/config/config.env')

app.listen(configs.port, () => console.log(`Server running on port: ${configs.port}`))
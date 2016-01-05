'use strict'
const expres = require('express')
const wagner = requre('wagner-core')
const port = process.env.PORT || 12000

require('./modelos')(wagner)
require('./dependencias')(wagner)

const app = express()

wagner.invoke(require('./autenticacion'),{ app: app })

app.use('/api/v1', require('./api')(wagner))

app.listen(port)
console.log('Pa ke quieres saber eso jajaja saludos')

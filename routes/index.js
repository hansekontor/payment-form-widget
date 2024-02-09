// Main router entry point, sets up all route modules

const express = require('express')
const router = express.Router()

const formRouter = require('./formRouter')
const paymentRouter = require('./paymentRouter')

router.use('/form', formRouter)
router.use('/payment', paymentRouter)

module.exports = router
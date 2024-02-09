// All Payment routes

const express = require('express')
const router = express.Router()

const { postPayment } = require('../controllers/paymentController')
const { postSandbox } = require('../controllers/paymentController')
const { postPaymentResult } = require('../controllers/paymentController')

router.post('/live', postPayment);
router.post('/sandbox', postSandbox);
router.post('/listen', postPaymentResult);

module.exports = router